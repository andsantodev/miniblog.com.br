// page home
const URL = `https://jsonplaceholder.typicode.com/posts`
const loadingElement = document.querySelector('#loading')
const postsContainer = document.querySelector('#posts-container')

// page post
const postPage = document.querySelector('#post')
const postContainer = document.querySelector('#post-container')
const commentsContainer = document.querySelector('#comments-container')

// comment form
const commentForm = document.querySelector('#comment-form')
const emailInput = document.querySelector('#email')
const bodyInput = document.querySelector('textarea[id="body"]')

// Get id from URL
const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get('id')

// Get all posts
async function getAllPosts() {
  const response = await fetch(URL)
  const data = await response.json()
  loadingElement.classList.add('hide')

  // go through each element
  data.map((post) => {
    const div = document.createElement('div')
    const title = document.createElement('h2')
    const body = document.createElement('p')
    const link = document.createElement('a')

    title.innerText = post.title
    body.innerText = post.body
    link.innerText = 'Saiba mais'
    link.setAttribute('href', `/post.html?id=${post.id}`)

    div.appendChild(title)
    div.appendChild(body)
    div.appendChild(link)

    postsContainer.appendChild(div)
  })
}

// Get individual post
async function getPost(id) {
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${URL}/${id}`),
    fetch(`${URL}/${id}/comments`)
  ])
  const dataPost = await responsePost.json()
  const dataComments = await responseComments.json()

  loadingElement.classList.add('hide')
  postPage.classList.remove('hide')

  const title = document.createElement('h1')
  const body = document.createElement('p')
  
  title.innerText = dataPost.title
  body.innerText = dataPost.body

  postContainer.appendChild(title)
  postContainer.appendChild(body)

  dataComments.map((comment) => {
    createComment(comment)
  })
}

// create comment
function createComment(comment) {
  const div = document.createElement('div')
  const email = document.createElement('h3')
  const commentBody = document.createElement('p')

  email.innerText = comment.email
  commentBody.innerText = comment.body

  div.appendChild(email)
  div.appendChild(commentBody)
  commentsContainer.appendChild(div)    
}

// post a comment
async function postComment(comment) {
  const response = await fetch(`${URL}/${postId}/comments`, {
    method: "POST",
    body: comment,
    headers:{
      "Content-type": "application/json",
    }
  })

  const data = await response.json()
  createComment(data)
}

// Execute
if (!postId) {
  getAllPosts()
} else {
  getPost(postId)

  // add event to comment form
  commentForm.addEventListener('submit', (e => {
    e.preventDefault()
    let comment = {
      email: emailInput.value,
      body: bodyInput.value
    }
    comment = JSON.stringify(comment)
    postComment(comment)
  }))
}
