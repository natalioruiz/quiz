var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
    models.Quiz.find(req.params.quizId).then(
        function(quiz) {
            if (quiz) {
                req.quiz = quiz;
                next()
            } else { new Error("No existe quizId-" + quizId) }
        }
    ).catch(function(error) { next(error) });
};


// GET /quizes/question
exports.show = function(req, res) {
    res.render("quizes/show", { quiz: req.quiz });
};

// GET /quizes/answer
exports.answer = function(req, res) {
    var resultado = "Incorrecto";
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = "Correcto";
    }
    res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};

exports.index = function(req, res) {
    var render = function(quizes) {
        console.log("quizes: ", quizes);
        res.render('quizes/index.ejs', {quizes: quizes});
    }

    if (req.query.search) {
        var condition = {
            where: ["pregunta like ?", "%" + req.query.search.replace(" ", "%") + "%"]
        };
        models.Quiz.findAll(condition).then(render).catch(function(error) { next(error); });
    } else {
        models.Quiz.findAll().then(render).catch(function(error) { next(error); });
    }
};

exports.new = function(req, res) {
    var quiz = models.Quiz.build(
        {
            pregunta: "Pregunta",
            respuesta: "Respuesta"
        }
    )

    res.render('quizes/new', {quiz: quiz});
}

exports.create = function(req, res) {
    var quiz = models.Quiz.build(req.body.quiz);

    console.log("QUIZ: ", quiz);

    quiz.validate().then(function(err) {
        if (err) {
            res.render('quizes/new', {quiz: quiz, errors: err.errors });
        } else {
            quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function() {
                res.redirect('/quizes');
            });
        }
    });

};

exports.edit = function(req, res) {
    var quiz =  req.quiz;

    res.render('quizes/edit', { quiz: quiz });
};

exports.update = function(req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;

    req.quiz.validate().then(function(err) {
        if (err) {
            res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
        } else {
            req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function() {
                res.redirect('/quizes');
            });
        }
    });
};

exports.destroy = function(req, res) {
    req.quiz.destroy().then(function() {
        res.redirect('/quizes');
    }).catch(function(error) { next(error); });
}