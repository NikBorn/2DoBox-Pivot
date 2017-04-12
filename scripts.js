filterPriority();
loadTasks();

function loadTasks() {
  for (var i = 0; i < localStorage.length; i++) {
    prepend(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
};

$('.input-title, .input-task').on('input', function () {
  var inputTitleVal = $('.input-title').val();
  var inputTaskVal = $('.input-task').val();
  if (inputTitleVal == '' || inputTaskVal == '') {
    $('.button-save').attr('disabled', true);
  } else if (inputTitleVal == 'Title') {
    $('.button-save').attr('disabled', true);
  } else if (inputTaskVal == 'Task') {
    $('.button-save').attr('disabled', true);
  } else {
    $('.button-save').attr('disabled', false);
  };
});

/*=======================================
>>>>>>>>  Constructor / New  <<<<<<<<
========================================*/

function Task(title, task) {
  this.title = title;
  this.task = task;
  this.priority = 'Normal';
  this.id = Date.now();
	this.status = 'not-complete'
};

$('.button-save').on('click', function () {
  var title = $('.input-title').val();
  var task = $('.input-task').val();
  var task = new Task(title, task);
  prepend(task);
  sendToStorage(task);
  $('.button-save').prop('disabled', true);
});

/*=======================================
>>>>>>>>  localStorage  <<<<<<<<
========================================*/

function grabObject(id) {
  var parsedObject = JSON.parse(localStorage.getItem(id));
  return parsedObject;
}

function storeObject(id, newObject) {
  localStorage.setItem(id, JSON.stringify(newObject));
}

function sendToStorage(task) {
  localStorage.setItem(task.id, JSON.stringify(task));
}

$('.new-task-container').on('blur', '.new-task-header', function () {
  var id = $(this).closest('.new-task-article').prop('id');
  var parsedObject = JSON.parse(localStorage.getItem(id));
  parsedObject.title = $(this).text();
  localStorage.setItem(id, JSON.stringify(parsedObject));
});

$('.new-task-container').on('blur', '.new-task-body', function () {
  var id = $(this).closest('.new-task-article').prop('id');
  var parsedObject = JSON.parse(localStorage.getItem(id));
  parsedObject.task = $(this).text();
  localStorage.setItem(id, JSON.stringify(parsedObject));
});

/*=======================================
>>>>>>>>  Click Events <<<<<<<<
========================================*/

function changePriorityToLow(id) {
  var newObject = grabObject(id);
  newObject.priority = 'Low';
  storeObject(id, newObject);
}

function changePriorityToNormal(id) {
  var newObject = grabObject(id);
  newObject.priority = 'Normal';
  storeObject(id, newObject);
}

function changePriorityToHigh(id) {
  var newObject = grabObject(id);
  newObject.priority = 'High';
  storeObject(id, newObject);
}

function changePriorityToCritical(id) {
  var newObject = grabObject(id);
  newObject.priority = 'Critical';
  storeObject(id, newObject);
}

function changePriorityToNone(passId) {
  var newObject = grabObject(passId);
  newObject.priority = 'None';
  storeObject(passId, newObject);
}

$('.new-task-container').on('click', '.upvote-image', function () {
  var id = $(this).parent().parent().prop('id');
  var newObject = grabObject(id);
  var parsedPriority = grabObject(id).priority;
  var passId = id;
  if (parsedPriority == 'None') {
    changePriorityToLow(passId);
    $(this).siblings().last().text('Low');
  } else if (parsedPriority == 'Low') {
    changePriorityToNormal(passId);
    $(this).siblings().last().text('Normal');
  } else if (parsedPriority == 'Normal') {
    changePriorityToHigh(passId);
    $(this).siblings().last().text('High');
  } else if (parsedPriority == 'High') {
    changePriorityToCritical(passId);
    $(this).siblings().last().text('Critical');
  };
});

$('.new-task-container').on('click', '.downvote-image', function () {
  var id = $(this).parent().parent().prop('id');
  var newObject = grabObject(id);
  var parsedPriority = grabObject(id).priority;
  var passId = id;
  if (parsedPriority == 'Critical') {
    changePriorityToHigh(passId);
    $(this).siblings().last().text('High');
  } else if (parsedPriority == 'High') {
    changePriorityToNormal(passId);
    $(this).siblings().last().text('Normal');
  } else if (parsedPriority == 'Normal') {
    changePriorityToLow(passId);
    $(this).siblings().last().text('Low');
  } else if (parsedPriority == 'Low') {
    $(this).siblings().last().text('None');
    changePriorityToNone(passId);
  };
});

$('.new-task-container').on('click', '.delete-image', function () {
  localStorage.removeItem($(this).parent().parent().prop('id'));
  $(this).parent().parent().remove('.new-task-article');
});

$('.new-task-container').on('click', '.completed-btn', function () {
  var $this = $(this);
	var card = $this.closest('.new-task-article')
	var id = card.attr('id')
	var taskCard = grabObject(id);
	console.log(id)
	console.log(taskCard)
	storeObject(id, taskCard);

	$this.closest('.new-task-article').toggleClass('completed');
  if ($this.closest('.new-task-article').hasClass('completed')) {
    $this.text('Completed!');
		taskCard.status = 'completed';
		console.log('id',id)
		console.log('taskcard',taskCard)
		storeObject(id, taskCard);
  } else {
    $this.text('Not Complete');
		taskCard.status = 'not-complete';
		console.log('id',id)
		console.log('taskcard', taskCard)
		storeObject(id, taskCard);
  };
});

/*=======================================
>>>>>>>>  Prepend  <<<<<<<<
========================================*/

function prepend(task) {
  $('.new-task-container').prepend(`
    <div id='${task.id}' class='new-task-article ${task.status}'>
			<div class="completed-btn-container">
				<button class='completed-btn' type='button'>Not Complete</button>
			</div>
	    <div class='text-wrapper'>
				<p class='new-task-header' role="textbox" aria-multiline="true" contenteditable>${task.title}</p>
	    	<button class='delete-image' type='button' name='button'></button>
				<p class='new-task-body' role="textbox" aria-multiline="true" contenteditable>${task.task}</p>
			</div>
	    <section class='new-task-footer'>
				<button class='upvote-image' type='button' name='button'></button>
				<button class='downvote-image' type='button' name='button'></button>
	    	<h3 class='h3-footer'>priority: &nbsp;&nbsp; </h3><h3 class="priority-value">${task.priority}</h3>
	    </section>
    </div>
    `);
  $('.input-title').val('');
  $('.input-task').val('');
}

/*=======================================
>>>>>>>>  Key Press / Key Up Events <<<<<<<<
========================================*/

$('.input-filter').on('keyup', function () {
  var filterInput = $(this).val().toLowerCase();
  $('.text-wrapper').each(function () {
    var cardText = $(this).text().toLowerCase();
    if (cardText.indexOf(filterInput) != -1) {
      $(this).parent().show();
    } else {
      $(this).parent().hide();
    }
  });
});

function filterPriority() {
  $('.priority-btn').on('click', function () {
    var buttonValue = $(this).text();
    $('.priority-value').each(function () {
      var taskValue = $(this).text();
      if (taskValue.indexOf(buttonValue) != -1) {
        $(this).closest('.new-task-article').show();
      } else {
        $(this).closest('.new-task-article').hide();
      }
    });
  });
}
