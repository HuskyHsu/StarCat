const repoList = [
  ...document.querySelectorAll(
    '#user-starred-repos div.starred details-menu.SelectMenu[role="menu"]'
  ),
];

console.log(`repoList: ${repoList.length}`)

for (const repo of repoList) {
  const link = repo.attributes.src.value

  fetch(link)
    .then(function (response) {
      return response.text();
    })
    .then(function (htmlString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const inputs = [...doc.querySelectorAll('input:checked')];

      const tags = inputs
        .map((input) => input.nextElementSibling?.textContent?.trim())
        .map((tag) => {
          const span = document.createElement('span');
          span.textContent = tag || ""
          span.classList.add("Label", "Label--success", "Label--inline", "px-2", "mr-2")
          span.style.lineHeight = "22px"
          return span
        })

      const starBtnGroup = repo.parentElement.parentElement
      const firstChild = starBtnGroup.firstElementChild;
      tags.forEach(span => {
        starBtnGroup.insertBefore(span, firstChild);
      });

    });

}