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
	this.quality = "Normal";
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

function changeQualityToLow(id) {
	var newObject = grabObject(id);
	newObject.quality = "Low";
	storeObject(id, newObject);
}

function changeQualityToNormal(id) {
	var newObject = grabObject(id);
	newObject.quality = "Normal";
	storeObject(id, newObject);
}

function changeQualityToHigh(id) {
	var newObject = grabObject(id);
	newObject.quality = "High";
	storeObject(id, newObject);
}

function changeQualityToCritical(id) {
	var newObject = grabObject(id);
	newObject.quality = "Critical";
	storeObject(id, newObject);
}

function changeQualityToNone(passId) {
	var newObject = grabObject(passId);
	newObject.quality = "None";
	storeObject(passId, newObject);
}

$(".new-task-container").on("click", ".upvote-image", function() {
	var id = $(this).parent().parent().prop('id');
	var newObject = grabObject(id)
	var parshedQuality = grabObject(id).quality
	var passId = id
	if (parshedQuality == "None") {
		changeQualityToLow(passId);
		$(this).siblings().last().text("Low");
	} else if (parshedQuality == "Low") {
		changeQualityToNormal(passId);
		$(this).siblings().last().text("Normal");
	} else if (parshedQuality == "Normal") {
		changeQualityToHigh(passId);
		$(this).siblings().last().text("High");
	} else if (parshedQuality == "High") {
		changeQualityToCritical(passId);
		$(this).siblings().last().text("Critical");
	}
})

$(".new-task-container").on("click", ".downvote-image", function() {
	var id = $(this).parent().parent().prop('id');
	var newObject = grabObject(id)
	var parshedQuality = grabObject(id).quality
	var passId = id
	if (parshedQuality == "Critical") {
		changeQualityToHigh(passId);
		$(this).siblings().last().text("High");
	} else if (parshedQuality == "High") {
		changeQualityToNormal(passId);
		$(this).siblings().last().text("Normal");
	} else if (parshedQuality == "Normal") {
		changeQualityToLow(passId);
		$(this).siblings().last().text("Low");
	} else if (parshedQuality == "Low") {
		$(this).siblings().last().text("None");
		changeQualityToNone(passId);
	}
})

$(".new-task-container").on('click', '.delete-image', function() {
	localStorage.removeItem($(this).parent().parent().prop('id'));
	$(this).parent().parent().remove('.new-task-article');
});

// NOTE: I can't get it to change BACK from Completed!
$('.new-task-container').on('click', '.completed-btn', function() {
	$(this).closest('.new-task-article').toggleClass('completed');
	// $(this).closest('p').toggleClass('completed-btn-text');
	// var completedStatus = $(this);
	if ($(this).text('Not Complete')) {
		$(this).text('Completed!');
	} else if ($(this).text('Completed!')) {
		$(this).text('Not Complete');
	}
})

/*=======================================
>>>>>>>>  Prepend  <<<<<<<<
========================================*/

function prepend(task) {
	$(".new-task-container").prepend(`
    <div id="${task.id}" class="new-task-article">
		<button class="completed-btn" type="button"><span><p>Not Complete</p></span></button>
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


// delete this shit
