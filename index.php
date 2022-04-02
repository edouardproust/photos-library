<?php
$title = "Free Photos Stock";
require 'config.php';

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- style -->
    <link rel="stylesheet" href="<?= APP_PATH ?>style.css">
    <link rel="stylesheet" href="<?= APP_PATH ?>lib/fonts/montserrat/montserrat.css">
    <!-- scripts -->
    <script defer src="<?= APP_PATH ?>lib/js/gsap/gsap.min.js"></script>
    <script defer src="<?= APP_PATH ?>lib/js/chroma.min.js"></script>
    <script defer src="<?= APP_PATH ?>lib/js/lottie.min.js"></script>
    <script defer src="<?= APP_PATH ?>config.js"></script>
    <script defer src="<?= APP_PATH ?>src/Photo.js"></script>
    <script defer src="<?= APP_PATH ?>src/Gallery.js"></script>
    <script type="module" defer src="<?= APP_PATH ?>app.js"></script>
    <title><?= $title ?></title>
</head>

<body>
    <header class="title-container">
        <h1><?= $title ?></h1>
    </header>
    <div class="gallery"></div>

    <!-- font awesome -->
    <link rel="stylesheet" href="<?= APP_PATH ?>lib/fonts/font-awesome/all.css">
</body>

</html>