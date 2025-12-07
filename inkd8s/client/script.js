fetch('http://localhost:3000/rankings')
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById('rankings');
    div.innerHTML = '<ul>' + data.map(u => `<li>${u.username}: ${u.elo}</li>`).join('') + '</ul>';
  });