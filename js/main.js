for (var x = 1; x < 5; x++) {
    dtg(['.click-skills-' + x, '.btn-square-skills-' + x]).each(function (value) {
        var i = x;

        dtg(value).click(function () {
            dtg('.container').toggleClass('clear');
            dtg('.square-skills-' + i).toggleClass('clear');
        });
    });
}