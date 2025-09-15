const cl = console.log;
const usernameForm = document.getElementById('usernameForm');
const usernameControl = document.getElementById('username');
const dashBoard = document.getElementById('dashBoard');
const loader = document.getElementById('loader');
const base_url = `https://api.github.com/users`;

const makeApiCall = async (method, url, body) => {
  loader.classList.remove('d-none')
  let jsonBody = body ? JSON.stringify(body) : null
  try{
    let res = await fetch(url, {
      method: method,
      body: jsonBody,
      headers: {
        // "auth": "token",
        "content-type": "application/json"
      }
    })
    if(!res.ok){
      console.error(`${res.status}: Error occured`)
    }else{
      return res.json()
    }
  }catch(err){
    console.error(err)
  }finally{
    loader.classList.add('d-none')
    usernameForm.reset()
  }
};

const createRepoLinks = (arr) => {
  let result = ``
  arr.forEach(obj => {
    result += `<li><a href="https://github.com/${obj.full_name}" target="_blank">${obj.name}</a></li>`
  })
  return result
};

const showDash = (obj, arr) => {
  let noName = "Anonymous"
  let result = `
    <div class="col-lg-6 col-md-8 row py-4 bg-teal rad-10">
			<div class="col-3 p-0 d-flex justify-content-center align-items-center">
				<figure class="avatarImg m-0">
					<img src="${obj.avatar_url}" alt="Img">
				</figure>
			</div>
			<div class="col-9">
				<h4>${obj.name || noName}</h4>
				<ul class="social p-0 mb-2">
					<li>${obj.followers} Followers</li>
					<li>${obj.following} Following</li>
					<li>${obj.public_repos} Repos</li>
				</ul>
				<ul class="rapoLinks p-0 m-0">
          ${createRepoLinks(arr)}
				</ul>
			</div>
		</div>`
  dashBoard.innerHTML = result
}

const onSearch = async (eve) => {
  eve.preventDefault()
  let username = usernameControl.value
  let userDetails_url = `${base_url}/${username}`
  let userRepos_url = `${userDetails_url}/repos?sort=created`
  let promiseArray = [makeApiCall('GET', userDetails_url, null), makeApiCall('GET', userRepos_url, null)]
  let [userDetailsArray, userReposArray] = await Promise.all(promiseArray)
  cl(userDetailsArray, userReposArray)
  if(userReposArray.length > 5){
    userDetailsArray = userDetailsArray.slice(0, 5)
  }
  showDash(userDetailsArray, userReposArray)
};

usernameForm.addEventListener('submit', onSearch)