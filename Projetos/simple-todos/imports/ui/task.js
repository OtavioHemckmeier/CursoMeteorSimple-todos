import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './task.html';

import './task.js';
import './body.html';
import './task.html';

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.task.events({
  'click .finalizar'() {
    alert(this.situacao);
     Meteor.call('tasks.setFinalizada', this._id);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('tsasks.setPrivate', this._id, !this.private);
  },
  'click .clonar'() {
    const titulo = (`${this.titulo}-clonada`);
    Meteor.call('tasks.insert', titulo, this.descricao, this.prevTermino, this.envolvidos, function (erro, resposta) {
      if(erro) console.log('erro', erro);
      if(resposta) console.log('resposta', resposta);
    });
  }
});


