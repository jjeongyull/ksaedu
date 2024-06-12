<?php
if (isset($_POST['input']) && isset($_POST['mode'])) {
	ob_start();

	// Needs decoding because $_POST is encoded when jQuery.ajax sended the data.
	$input = urldecode($_POST['input']);

	switch ($_POST['mode']) {
		case 'serialize':
			$output = serialize($input);
			break;
		case 'unserialize':
			$output = unserialize($input);
			break;
		case 'url_encode':
			$output = urlencode($input);
			break;
		case 'url_decode':
			$output = urldecode($input);
			break;
		case 'html_encode':
			$output = htmlentities($input, ENT_QUOTES, 'UTF-8');
			break;
		case 'html_decode':
			$output = html_entity_decode($input);
			break;
		default:
			break;
	}

	if (isset($output) && !is_string($output)) {
		$output = is_array($output) ? var_export($output, true) : $output;
	}

	echo $output;
	ob_end_flush();
	exit();
}
?>
<!DOCTYPE HTML>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title>Encodes/Decodes</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js"></script>
	<script type="text/javascript">
//![CDATA[
$(function() {
	var popup = function(message, class_name) {
		class_name = !class_name ? 'processing' : class_name;
		$('#status').text(message).attr('class', class_name).slideDown();
		console.log(class_name);
	}

	$('#submit').click(function(e) {
		e.preventDefault();

		if (!($("input[name=mode]:checked").val())) {
			popup('Choose mode.', 'error');
			return false;
		}

		if (!($("#input_text").val())) {
			popup('Enter strings.', 'error');
			return false;
		}

		$('#submit').attr('disabled', true);
		popup('processing...', 'processing');

		$.ajax({
			url: '<?php echo $_SERVER["REQUEST_URI"]; ?>',
			type: 'post',
			dataType: 'text',
			data: {
				mode: $("input[name=mode]:checked").val(),
				input: $("#input_text").val()
			},
			success: function() {
				popup('Done.', 'success');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				popup('Error occured.', 'error');
			},
			complete: function(data) {
				$('#output').val(data.responseText).select();
				$('#submit').attr('disabled', false);
			}
		});
	});

	$('#reset').click(function(e) {
		e.preventDefault();
		$('input:radio').attr('checked', false);
		$('textarea').val('');
		$('#status').slideUp();
	});
});
//]]
	</script>
	<style type="text/css" media="screen">
		#input_text {width:100%; height:10em;}
		#output {width:100%; height:10em; overflow:scroll; border:1px solid #060; background:#dfd; color:#030; white-space:pre-line; white-space: -moz-pre-wrap; white-space:-o-pre-wrap; }
		#status {display:none; font-weight:bold;}

		.success {background:#afa;}
		.error {background:#faa;}
		.processing {background:#ddd;}
	</style>
</head>
<body>
	<h1>Encodes/Decodes</h1>

	<form name="utils" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
		<h2>STEP 1: Choose mode</h2>
		<fieldset id="url_encoding">
			<legend>URL Encoding</legend>
			<label for="url_encode">encode</label><input type="radio" name="mode" value="url_encode" id="url_encode">
			<label for="url_decode">decode</label><input type="radio" name="mode" value="url_decode" id="url_decode">
		</fieldset>
		<fieldset>
			<legend>HTML Entities</legend>
			<label for="html_encode">encode</label><input type="radio" name="mode" value="html_encode" id="html_encode">
			<label for="html_decode">decode</label><input type="radio" name="mode" value="html_decode" id="html_decode">
		</fieldset>
		<fieldset>
			<legend>Serializer</legend>
			<label for="serialize">Serialize</label><input type="radio" name="mode" value="serialize" id="serialize">
			<label for="unserialize">Unserialize</label><input type="radio" name="mode" value="unserialize" id="unserialize">
		</fieldset>

		<h2>STEP 2: Enter strings</h2>

		<textarea name="input" id="input_text"><?php echo $_POST['input'] ?></textarea>

		<p><button id="submit">Submit</button> <button id="reset">Reset</button></p>
	</form>

	<h2>Result</h2>

	<div id="status"></div>

	<textarea id="output"><?php echo $output; ?></textarea>
</body>
</html>