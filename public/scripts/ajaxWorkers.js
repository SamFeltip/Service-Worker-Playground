document.getElementById('run-ajax').addEventListener('click', async () => {
  fetch('/getAjaxData').then(async (response) => {
    let strHtml = await response.text();
    
    let ajaxTarget = document.getElementById('ajax-target');
    ajaxTarget.innerHTML = strHtml;

  }).catch(err => {
    console.error(err);
  })
})