var pageTop  = '#page-top',
	$pageTop = $(pageTop);
var pageEditor  = '#page-editor',
	$pageEditor = $(pageEditor);

// Page Top Randaring
if($pageTop.length > 0) {
	App.page.top.build();
}

// Page Editor Randaring
if($pageEditor.length > 0) {
	App.page.editor.build();
}
