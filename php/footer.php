<?php
	//$path is the path to the root of public_html directory
	function foot($path) {
		$out = "</html>";
		$out .= <<<__HTML
		<footer>
		<img src="$path/assets/powered-by-google-on-non-white.png">
		<p> &copy; 2015 Tom Kowalski </p>
		</footer>
__HTML;
	return $out;
	}
?>
