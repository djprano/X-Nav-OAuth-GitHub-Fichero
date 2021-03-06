

function errorSendFile(err){
	console.log(err);
}

function sendFile(){
	var filename = $('#filename').val();
	var filecontent = $('#fileContent').val();
	repo.write('master', filename, filecontent, 'update', errorSendFile);
	$('#readFile').show('fast');

}

function showRepoInfo(error,repo){
	var repodata = $("#repodata");
	if(error){
		repodata.html("<p>Error " + error.error + "</p>");
	}else{
		repodata.html("<p>Repository data:</p>"+
			"<li>Name: "+ repo.full_name+"</li>"+
			"<li>Description: "+repo.description+"</li>"+
			"<li>Created at: "+repo.created_at+"</li>");
	}
	$('#fileData').show('fast');
};

function getRepo(){
	var user = $("#user").val();
	var reponame = $("#repo").val();
    repo = github.getRepo(user,reponame);
    repo.show(showRepoInfo);
};

function login(){
	auth = hello('github').getAuthResponse();
	token = auth.access_token;
	console.log(token);
	github = new Github ({
		token: token,
		auth: "oauth"
	});
	$('#redirect').hide('fast');
	$('#repoform').show('fast');
}

function error_login(e){
	alert(e.error.message);
}

function readFile(){
	repo.read('master',$('#filename').val(), function(err, data) {
	console.log (err, data);
	$("#repodata").append("<p>Contents:</p><p>" + data + "</p>");
    });
}

$(document).ready(function(){
	hello.init({github : '81880c547d6a143b59a7'},{
		redirect_uri : 'redirect.html',
		oauth_proxy : 'https://auth-server.herokuapp.com/proxy'});
	access = hello('github');
	access.login({response_type: 'code'}).then(login,error_login);

	$('#getRepoData').click(getRepo);
	$('div#fileData button').click(sendFile);
	$('div#readFile button').click(readFile);
});