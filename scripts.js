$(document).ready(function() {
	for (var i = 0; i < localStorage.length; i++) {
		prepend(JSON.parse(localStorage.getItem(localStorage.key(i))));
	}
});

$('.input-title, .input-task').on('input', function() {
	var inputTitleVal = $(".input-title").val()
	var inputTaskVal = $(".input-task").val()
	if (inputTitleVal == '' || inputTaskVal == '') {
		$(".button-save").attr("disabled", true)
	} else if (inputTitleVal == 'Title') {
		$(".button-save").attr("disabled", true)
	} else if (inputTaskVal == 'Task') {
		$(".button-save").attr("disabled", true)
	} else {
		$(".button-save").attr("disabled", false)
	}
})

/*=======================================
>>>>>>>>  Constructor / New  <<<<<<<<
========================================*/

function Task(title, task) {
	this.title = title;
	this.task = task;
	this.quality = "swill";
	this.id = Date.now();
}


$(".button-save").on("click", function() {
	var title = $('.input-title').val();
	var task = $(".input-task").val();
	var task = new Task(title, task);
	prepend(task);
	sendToStorage(task);
	$(".button-save").prop("disabled", true)
});

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

$(".new-task-container").on("blur", '.new-task-header', function() {
	var id = $(this).closest(".new-task-article").prop('id');
	var parsedObject = JSON.parse(localStorage.getItem(id))
	parsedObject.title = $(this).text()
	console.log(this)
	localStorage.setItem(id, JSON.stringify(parsedObject))
})

$(".new-task-container").on("blur", '.new-task-body', function() {
	var id = $(this).closest(".new-task-article").prop('id');
	var parsedObject = JSON.parse(localStorage.getItem(id))
	parsedObject.task = $(this).text()
	localStorage.setItem(id, JSON.stringify(parsedObject))
})

/*=======================================
>>>>>>>>  Click Events <<<<<<<<
========================================*/

$(".new-task-container").on("click", ".upvote-image", function() {
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

$(".new-task-container").on("click", ".downvote-image", function() {
	var id = $(this).parent().parent().prop('id');
	var newObject = grabObject(id)
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

$(".new-task-container").on('click', '.delete-image', function() {
	localStorage.removeItem($(this).parent().parent().prop('id'));
	$(this).parent().parent().remove('.new-task-article');
});

/*=======================================
>>>>>>>>  Prepend  <<<<<<<<
========================================*/

function prepend(task) {
	$(".new-task-container").prepend(`
    <div id="${task.id}" class="new-task-article">
		<button class="completed-btn" type="button">Not Complete</button>
	    <div class="text-wrapper">
				<p class="new-task-header" contenteditable>${task.title}</p>
	    	<button class="delete-image" type="button" name="button"></button>
				<p class="new-task-body" contenteditable>${task.task}</p>
			</div>
	    <section class="new-task-footer">
				<button class="upvote-image" type="button" name="button"></button>
				<button class="downvote-image" type="button" name="button"></button>
	    	<h3 class="h3-footer">quality:</h3><h3>${task.quality}</h3>
	    </section>
    </div>
    `);
	$('.input-title').val("")
	$('.input-task').val("")
}

/*=======================================
>>>>>>>>  Key Press / Key Up Events <<<<<<<<
========================================*/

$('.input-filter').on('keyup', function() {
	var filterInput = $(this).val().toLowerCase();
	$('.text-wrapper').each(function() {
		var cardText = $(this).text().toLowerCase();
		if (cardText.indexOf(filterInput) != -1) {
			$(this).parent().show();
		} else {
			$(this).parent().hide();
		}
	})
})
