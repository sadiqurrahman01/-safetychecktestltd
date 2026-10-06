(function(){
'use strict';

var KEY='sct_consent_v1';
var VERSION=1;
var ADDRESS='Level 18, 40 Bank Street, Canary Wharf, London, E14 5NR';

function esc(s){
  return String(s).replace(/[&<>"']/g,function(c){
    return {
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#039;'
    }[c];
  });
}

function readConsent(){
  try{
    var x=JSON.parse(localStorage.getItem(KEY)||'null');
    return x&&x.version===VERSION?x:null;
  }catch(e){
    return null;
  }
}

function writeConsent(v){
  var x={
    version:VERSION,
    necessary:true,
    analytics:!!v.analytics,
    marketing:!!v.marketing,
    updatedAt:new Date().toISOString()
  };

  try{
    localStorage.setItem(KEY,JSON.stringify(x));
  }catch(e){}

  applyConsent(x);
  return x;
}

function activate(category){
  document
    .querySelectorAll(
      'script[type="text/plain"][data-sct-consent="'+category+'"]:not([data-sct-activated])'
    )
    .forEach(function(old){
      var s=document.createElement('script');

      Array.prototype.slice.call(old.attributes).forEach(function(a){
        if(
          a.name!=='type' &&
          a.name!=='data-sct-consent' &&
          a.name!=='data-sct-activated'
        ){
          s.setAttribute(a.name,a.value);
        }
      });

      s.text=old.text||old.textContent||'';
      s.setAttribute('data-sct-activated','1');
      old.setAttribute('data-sct-activated','1');
      old.parentNode.insertBefore(s,old.nextSibling);
    });
}

function applyConsent(c){
  if(!c)return;

  if(c.analytics)activate('analytics');
  if(c.marketing)activate('marketing');

  window.dispatchEvent(
    new CustomEvent('sct:consent',{detail:c})
  );
}

function trustMarkup(){
  return ''+
    '<div class="sct-trust-inner">'+
      '<div class="sct-sc-badge" role="img" aria-label="SafeContractor Approved">'+
        '<div class="sct-sc-shield" aria-hidden="true">&#10003;</div>'+
        '<div class="sct-sc-copy">'+
          '<strong>SafeContractor</strong>'+
          '<span>Approved</span>'+
        '</div>'+
      '</div>'+
      '<div class="sct-trust-details">'+
        '<h2>SafeContractor approved contractor</h2>'+
        '<p>'+
          'Safety Check Test Ltd - Certificate <strong>MX8819</strong>, '+
          'valid until <strong>15 June 2027</strong>. '+
          '<a href="https://www.ssipportal.org.uk/" target="_blank" rel="noopener noreferrer">'+
            'Validate via the SSIP Portal'+
          '</a>.'+
        '</p>'+
      '</div>'+
    '</div>';
}

function mountTrust(){
  if(document.getElementById('sct-trust-strip'))return;

  var root=document.getElementById('root');
  if(!root)return;

  var section=document.createElement('section');
  section.id='sct-trust-strip';
  section.setAttribute('aria-label','Accreditation');
  section.innerHTML=trustMarkup();

  var hero=root.querySelector('main section, section');

  if(hero&&hero.parentNode){
    hero.parentNode.insertBefore(section,hero.nextSibling);
  }else{
    root.insertBefore(section,root.firstChild);
  }
}

function mountAddress(){
  var contact=document.getElementById('contact');

  if(contact&&!contact.querySelector('#sct-office-address')){
    var actions=contact.querySelector('.sct-contact-actions')||contact;
    var card=document.createElement('div');

    card.id='sct-office-address';
    card.className='sct-office-card';
    card.innerHTML=
      '<span>Head Office</span>'+
      '<b>'+esc(ADDRESS)+'</b>';

    actions.appendChild(card);
  }
}

function mountLegal(){
  if(document.getElementById('sct-site-legal'))return;

  var el=document.createElement('footer');
  el.id='sct-site-legal';

  el.innerHTML=
    '<div class="sct-legal-inner">'+
      '<address class="sct-legal-address">'+
        '<strong>Safety Check Test Ltd</strong><br>'+
        esc(ADDRESS)+
      '</address>'+
      '<nav class="sct-legal-links" aria-label="Privacy links">'+
        '<a href="/privacy.html">Privacy Notice</a>'+
        '<a href="/cookies.html">Cookie Policy</a>'+
        '<button type="button" data-sct-cookie-settings>Cookie Settings</button>'+
      '</nav>'+
    '</div>';

  document.body.appendChild(el);
}

function banner(){
  var existing=document.getElementById('sct-cookie-banner');
  if(existing)return existing;

  var el=document.createElement('section');

  el.id='sct-cookie-banner';
  el.setAttribute('role','dialog');
  el.setAttribute('aria-modal','false');
  el.setAttribute('aria-labelledby','sct-cookie-title');

  el.innerHTML=
    '<div class="sct-cookie-copy">'+
      '<h2 id="sct-cookie-title">Your cookie choices</h2>'+
      '<p>'+
        'We use necessary browser storage to make this site work. '+
        'Optional analytics or marketing technologies are only enabled after you choose them. '+
        'Read our <a href="/cookies.html">Cookie Policy</a> and '+
        '<a href="/privacy.html">Privacy Notice</a>.'+
      '</p>'+
    '</div>'+
    '<div class="sct-cookie-actions">'+
      '<button class="sct-cookie-btn sct-cookie-primary" type="button" data-sct-accept>'+
        'Accept optional cookies'+
      '</button>'+
      '<button class="sct-cookie-btn sct-cookie-secondary" type="button" data-sct-reject>'+
        'Reject optional cookies'+
      '</button>'+
      '<button class="sct-cookie-btn sct-cookie-ghost" type="button" data-sct-manage>'+
        'Manage choices'+
      '</button>'+
    '</div>';

  document.body.appendChild(el);
  return el;
}

function modal(){
  var existing=document.getElementById('sct-cookie-modal');
  if(existing)return existing;

  var el=document.createElement('div');

  el.id='sct-cookie-modal';
  el.hidden=true;

  el.innerHTML=
    '<div class="sct-cookie-panel" role="dialog" aria-modal="true" aria-labelledby="sct-cookie-settings-title">'+
      '<h2 id="sct-cookie-settings-title">Cookie settings</h2>'+
      '<p>Choose which optional technologies may run. Necessary storage remains enabled for core site functions and to remember your privacy choice.</p>'+
      '<div class="sct-cookie-row">'+
        '<div><strong>Necessary</strong><small>Core site functions and privacy preferences.</small></div>'+
        '<input type="checkbox" checked disabled aria-label="Necessary storage enabled">'+
      '</div>'+
      '<div class="sct-cookie-row">'+
        '<div><strong>Analytics</strong><small>Helps measure site usage if analytics tools are configured.</small></div>'+
        '<input id="sct-consent-analytics" type="checkbox">'+
      '</div>'+
      '<div class="sct-cookie-row">'+
        '<div><strong>Marketing</strong><small>Used only if marketing tools are configured.</small></div>'+
        '<input id="sct-consent-marketing" type="checkbox">'+
      '</div>'+
      '<div class="sct-cookie-modal-actions">'+
        '<button class="sct-cookie-save" type="button" data-sct-save>Save choices</button>'+
        '<button class="sct-cookie-close" type="button" data-sct-close>Cancel</button>'+
      '</div>'+
    '</div>';

  document.body.appendChild(el);
  return el;
}

function openSettings(){
  var c=readConsent()||{
    analytics:false,
    marketing:false
  };

  var m=modal();

  m.querySelector('#sct-consent-analytics').checked=!!c.analytics;
  m.querySelector('#sct-consent-marketing').checked=!!c.marketing;
  m.hidden=false;
}

function closeSettings(){
  var m=document.getElementById('sct-cookie-modal');
  if(m)m.hidden=true;
}

function hideBanner(){
  var b=document.getElementById('sct-cookie-banner');
  if(b)b.hidden=true;
}

function wire(){
  document.addEventListener('click',function(e){
    var t=e.target.closest(
      '[data-sct-accept],'+
      '[data-sct-reject],'+
      '[data-sct-manage],'+
      '[data-sct-cookie-settings],'+
      '[data-sct-save],'+
      '[data-sct-close]'
    );

    if(!t)return;

    if(t.matches('[data-sct-accept]')){
      writeConsent({
        analytics:true,
        marketing:true
      });
      hideBanner();
      closeSettings();
    }
    else if(t.matches('[data-sct-reject]')){
      writeConsent({
        analytics:false,
        marketing:false
      });
      hideBanner();
      closeSettings();
    }
    else if(t.matches('[data-sct-manage],[data-sct-cookie-settings]')){
      openSettings();
    }
    else if(t.matches('[data-sct-save]')){
      var m=modal();

      writeConsent({
        analytics:m.querySelector('#sct-consent-analytics').checked,
        marketing:m.querySelector('#sct-consent-marketing').checked
      });

      hideBanner();
      closeSettings();
    }
    else if(t.matches('[data-sct-close]')){
      closeSettings();
    }
  });
}

function refresh(){
  mountTrust();
  mountAddress();
  mountLegal();
}

function start(){
  wire();
  refresh();

  var c=readConsent();

  if(c){
    applyConsent(c);
  }else{
    banner();
  }

  var root=document.getElementById('root');

  if(root){
    var observer=new MutationObserver(function(){
      refresh();
    });

    observer.observe(root,{
      childList:true,
      subtree:true
    });
  }

  setTimeout(refresh,400);
  setTimeout(refresh,1200);
  setTimeout(refresh,2500);

  window.SCTConsent={
    get:readConsent,
    open:openSettings,
    reset:function(){
      try{
        localStorage.removeItem(KEY);
      }catch(e){}
      location.reload();
    }
  };
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',start);
}else{
  start();
}

})();
