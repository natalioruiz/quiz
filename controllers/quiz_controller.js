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