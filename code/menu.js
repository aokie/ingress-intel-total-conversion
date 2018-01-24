Menu= (function () {


  function moveFromToolBox() {
    $('#toolbox a').each( parseToolBox );

    cleanupStylings();
  }

  function cleanupStylings() {
    $('#mainmenu > ul > li:not(:has(>ul))').remove();
    $('#mainmenu > ul > li:has(>ul)').addClass('has-sub');
  }

  function parseToolBox() {
    let $link = $(this);

    let menu = {
      name: $link.text(),
      tooltip:  $link.attr('title'),
      onclick: $link.attr('onclick'),
      key: $link.attr('accesskey'),
    };

    addMenu(menu);
  }

  function addMenu(menu_data) {
    let $entry = getOrCreateMenuLabel(menu_data.name);

    if (menu_data.onclick) {
      let fct = menu_data.onclick;
      if (typeof(fct)==='string') fct = new Function(fct);
      $entry.click(fct);
    }

    if (menu_data.id) $entry.attr('id',menu_data.id);
    if (menu_data.tooltip) $entry.attr('title',menu_data.tooltip);

    if (menu_data.isToggle) {
      let checker = $('<i>').addClass('checker');
      if (menu_data.default_checked)
        checker.addClass('checked');

      $entry.prepend(checker);
    }
  }

  function removeMenu(name) {
    let $entry = getOrCreateMenuLabel(name);
    $entry.remove();
    cleanupStylings();
  }

  function setChecked(name, checked) {
    let $entry = getOrCreateMenuLabel(name);
    $entry.find('i.checker').toggleClass('checked',checked);
  }

  function setDisable(name, disable) {
    let $entry = getOrCreateMenuLabel(name);
    $entry.toggleClass('disabled',disable);
  }


  function getOrCreateMenuLabel(name) {
    let $root = getRoot();

    let names = name.split('/');
    if (names.length===1) names.splice(0,0,'Misc');

    return getOrCreateMenuLabelSub($root, names);
  }

  function getOrCreateMenuLabelSub($root, names) {
    let $base = $root.find('> li').filter( function () {
      return $(this).contents().not($(this).children()).text() === names[0];
    });

    if ($base.length===0)  {
      $base = $('<li>'+names[0]+'</li>');
      $root.append($base);
    };

    names.splice(0,1);

    if (names.length===0) return $base;

    let $sub =  $base.find('> ul');
    if ($sub.length===0)  {
      $sub = $('<ul>');
      $base.append($sub);
    };

    return getOrCreateMenuLabelSub($sub, names);
  }

  function getRoot() {
    let $root = $('#mainmenu > ul')
    if ($root.length===0) {
      // FIXME: dynamic creation is required 'cause loading order of plugins might vary
      let menu = $('<div id="mainmenu"><ul></ul></div>')
      $( document.body ).append(menu);
      $root = $('#mainmenu > ul');
      createBasicMenu($root);
    }

    return $root;
  }

  function createBasicMenu($root) {
    getOrCreateMenuLabelSub($root,['Action']);
    getOrCreateMenuLabelSub($root,['View']);
    getOrCreateMenuLabelSub($root,['Info']);
    getOrCreateMenuLabelSub($root,['Misc']);
    getOrCreateMenuLabelSub($root,['Help']);

    addMenu({name: 'Help/About IITC', onclick: window.aboutIITC });
    addMenu({name: 'View/Zoom Control', onclick: toggleZoomControl, isToggle: true, default_checked: true});
    addMenu({name: 'View/Toolbox', onclick: toggleToolbox, isToggle: true, default_checked: true});
  }


  function toggleZoomControl() {
    let $ctrl = $(".leaflet-control-zoom");
    $ctrl.toggle();
    setChecked('View/Zoom Control', $ctrl.is(":visible"));
  }

  function toggleToolbox() {
    let $ctrl = $("#toolbox");
    $ctrl.toggle();
    setChecked('View/Toolbox', $ctrl.is(":visible"));
  }

  function setup() {
    window.setTimeout(Menu.moveFromToolBox,100);
  }

  return {
    setup : setup,
    addMenu: addMenu,
    removeMenu: removeMenu,
    setChecked: setChecked,
    setDisable: setDisable,
    moveFromToolBox: moveFromToolBox
  };

}());

