document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('post-form');
  const postsContainer = document.getElementById('posts');

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function displayPost(post) {
    const article = document.createElement('article');
    article.className = 'post fade-on-scroll';
    article.innerHTML = `<h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.content)}</p>`;
    postsContainer.prepend(article);
    initScrollAnimations();
  }

  function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('tipsPosts') || '[]');
    posts.forEach(displayPost);
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const titleEl = document.getElementById('post-title');
    const contentEl = document.getElementById('post-content');
    const title = titleEl.value.trim();
    const content = contentEl.value.trim();
    if (!title || !content) return;
    const post = { title, content, time: Date.now() };
    const posts = JSON.parse(localStorage.getItem('tipsPosts') || '[]');
    posts.unshift(post);
    localStorage.setItem('tipsPosts', JSON.stringify(posts));
    titleEl.value = '';
    contentEl.value = '';
    displayPost(post);
  });

  loadPosts();
});
