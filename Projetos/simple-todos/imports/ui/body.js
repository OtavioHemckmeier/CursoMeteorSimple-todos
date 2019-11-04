import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';
import './task.html';


Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const titulo = target.titulo.value;
    const descricao = target.descricao.value;
    const prevTermino = target.prevTermino.value;
    const envolvidos = target.envolvidos.value;

    if(titulo === ""){
      alert("O título da tarefa é um campo obrigatorio");
      document.getElementById('titulo').focus();
      event.preventDefault();
      return false;
    }
    if(prevTermino === ""){
      alert("A previsão de termino da tarefa é campo obrigatorio");
      document.getElementById('prevTermino').focus();
      event.preventDefault();
      return false;
    }
    // Insert a task into the collection
    Meteor.call('tasks.insert', titulo, descricao, prevTermino, envolvidos, function (erro, resposta) {
      if(erro) console.log('erro', erro);
      if(resposta) console.log('resposta', resposta);
    });

    // Clear form
    target.titulo.value = '';
    target.descricao.value = '';
    target.prevTermino.value = '';
    target.envolvidos.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});


