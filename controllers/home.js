
'use strict';
class home {
    verPrincipal(req, res) {
        require('./init/init');
        if (req.isAuthenticated()) {
            var rol = req.user.rol;
            console.log('//////////////////////////////////');
            console.log('-----------' + req.session.passport.user + '----------');
            console.log('-----------' + req.user.rolN + '----------');
            console.log('//////////////////////////////////');
            switch (rol) {
                case 1:
                    res.render('home',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'usuario': true});
                    break;
                case 2:
                    res.render('home',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'director': true});
                    break;
                case 3:
                    res.render('home',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'asistente': true});
                    break;
                case 4:
                    res.render('home',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'productor': true});
                    break;
                case 5:
                    res.render('home',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'actor': true});
                    break;
            }
        } else {
            res.render('home',
                    {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'nadie': true});

        }


    }

    verGaleria(req, res) {
        if (req.isAuthenticated()) {
            var rol = req.user.rol;
            console.log('//////////////////////////////////');
            console.log('-----------' + req.session.passport.user + '----------');
            console.log('-----------' + rol + '----------');
            console.log('//////////////////////////////////');
            switch (rol) {
                case 1:
                    res.render('galeria',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'usuario': true});
                    break;
                case 2:
                    res.render('galeria',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'director': true});
                    break;
                case 3:
                    res.render('galeria',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'asistente': true});
                    break;
                case 4:
                    res.render('galeria',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'productor': true});
                    break;
                case 5:
                    res.render('galeria',
                            {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'actor': true});
                    break;
            }
        } else {
            res.render('home',
                    {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'nadie': true});

        }
    }
}
module.exports = home;

