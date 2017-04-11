$(document).ready(function() {
	for (var i = 0; i < localStorage.length; i++) {
		prepend(JSON.parse(localStorage.getItem(localStorage.key(i))));
	}
});

$('#input-title').on('click', function() {
	$('#input-title').val(" ")
})
$('#input-task').on('click', function() {
	$('#input-task').val(" ")
})
$('#input-filter').on('click', function() {
	$('#input-filter').val(" ")
})

$('#input-title, #input-task').on('input', function() {
	var inputTitleVal = $("#input-title").val()
	var inputTaskVal = $("#input-task").val()

	if (inputTitleVal == '' || inputTaskVal == ' ') {
		$("#button-save").attr("disabled", true)
	} else if (inputTitleVal == 'Title') {
		$("#button-save").attr("disabled", true)
	} else if (inputTaskVal == 'Task') {
		$("#button-save").attr("disabled", true)
	} else {
		$("#button-save").attr("disabled", false)
	}
})

/*=======================================
>>>>>>>>  Constructor / New  <<<<<<<<
========================================*/

function Task(title, task) {
	this.title = title;
	this.task = task;
	this.quality = "swill"
	this.id = Date.now();
}


$(".button-save").on("click", function() {
	var title = $('#input-title').val();
	var task = $("#input-task").val();
	var task = new Task(title, task)
	prepend(task);
	sendToStorage(task);
})

/*=======================================
>>>>>>>>  localStorage  <<<<<<<<
========================================*/

function grabObject(id) {
	var parsedObject = JSON.parse(localStorage.getItem(id))
	return parsedObject;
}

function storeObject(id, newObject) {
	localStorage.setItem(id, JSON.stringify(newObject))
}

function sendToStorage(task) {
	localStorage.setItem(task.id, JSON.stringify(task))
}

$("#new-task-article").on("input", '.new-task-header', function() {
	var id = $(this).parent().parent().prop('id');
	var parsedObject = JSON.parse(localStorage.getItem(id))
	parsedObject.title = $(this).val()
	localStorage.setItem(id, JSON.stringify(parsedObject))
})
$("#new-task-article").on("input", '.new-task-body', function() {
	var id = $(this).parent().parent().prop('id');
	console.log(id)
	var parsedObject = JSON.parse(localStorage.getItem(id))
	console.log(parsedObject)
	parsedObject.task = $(this).val()
	localStorage.setItem(id, JSON.stringify(parsedObject))
})

/*=======================================
>>>>>>>>  Click Events <<<<<<<<
========================================*/

$("#new-task-article").on("click", ".upvote-image", function() {
	var id = $(this).parent().parent().prop('id');
	var newObject = grabObject(id)
	var parshedQuality = grabObject(id).quality

	if (parshedQuality == "swill") {
		newObject.quality = "plausible"
		$(this).siblings().last().text("plausible")
		storeObject(id, newObject)

	} else if (parshedQuality == "plausible") {
		newObject.quality = "genius"
		$(this).siblings().last().text("genius")
		storeObject(id, newObject)
	}
})

$("#new-task-article").on("click", ".downvote-image", function() {
	var id = $(this).parent().parent().prop('id');
	var newObject = grabObject(id)
	console.log("newobj" + newObject)
	var parshedQuality = grabObject(id).quality

	if (parshedQuality == "genius") {
		newObject.quality = "plausible"
		$(this).siblings().last().text("plausible")
		storeObject(id, newObject)

	} else if (parshedQuality == "plausible") {
		newObject.quality = "swill"
		$(this).siblings().last().text("swill")
		storeObject(id, newObject)
	}
})

$("#new-task-article").on('click', '.delete-image', function() {
	localStorage.removeItem($(this).parent().parent().prop('id'));
	$(this).parent().parent().remove('.new-task-article');
});

/*=======================================
>>>>>>>>  Prepend  <<<<<<<<
========================================*/

function prepend(task) {
	console.log(task.id);
	$("#new-task-article").prepend(`
    <div id="${task.id}" class="new-task-article">
	    <div class='text-wrapper'>
				<input type="text" class='new-task-header' value='${task.title}' maxlength="30" size="35">
	    	<button id='delete-image' class="delete-image" type="button" name="button"></button>
				<textarea rows="4" cols="42" id='new-task-body' class='new-task-body' value="">${task.task}</textarea>
			</div>
	    <section class="new-task-footer">
				<button id="upvote-image" class="upvote-image" type="button" name="button"></button>
				<button class="downvote-image" type="button" name="button"></button>
	    	<h3 class="h3-footer">quality:</h3><h3 id="quality">${task.quality}</h3>
	    </section>
    </div>
    `);
	$('#input-title').val("Title")
	$('#input-task').val("Task")
}

/*=======================================
>>>>>>>>  Key Press / Key Up Events <<<<<<<<
========================================*/

$('#input-filter').on('keyup', function() {
	var filterInput = $(this).val().toLowerCase();
	$('.text-wrapper').each(function() {
		var cardText = $(this).text().toLowerCase();

		if (cardText.indexOf(searchInput) != -1) {
			$(this).parent().show();
		} else {
			$(this).parent().hide();
		}
	})
})

$("#input-title").keypress(function(e) {
	if (e.which == 13) {
		$(".button-save").click()
	}
});

$("#input-task").keypress(function(e) {
	if (e.which == 13) {
		$(".button-save").click()
	}
});
