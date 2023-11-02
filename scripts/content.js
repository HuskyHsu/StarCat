function getSelectMenuList() {
  return [
    ...document.querySelectorAll(
      'div.starred details-menu.SelectMenu[role="menu"]'
    ),
  ]
}

async function getTags(detailsMenu) {
  const link = detailsMenu.attributes.getNamedItem("src")?.value || ''

  const response = await fetch(link)
  const htmlString = await response.text()

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const inputs = [...doc.querySelectorAll('input:checked')];

  const tags = inputs
    .map((input) => input.parentNode?.querySelector("span")?.textContent?.trim())

  const batchUrl = doc.querySelector("div")?.attributes.getNamedItem("data-batch-update-url")?.value
  let userId = ""
  if (typeof batchUrl === 'string') {
    userId = batchUrl.split("/")[2]
  }

  return { tags, userId }
}

function genSpan(tag) {
  const span = document.createElement('span');
  span.textContent = tag || ""
  span.classList.add("Label", "Label--success", "Label--inline", "px-2", "mr-2")
  span.style.lineHeight = "22px"
  return span
}

function genButtom(tag, userId) {
  const a = document.createElement("a");

  a.href = `/stars/${userId}/lists/${tag.replace(/ /g, "-")}`;
  a.classList.add("Button", "Button--secondary", "Button--small", "mr-1");

  const innerSpan1 = document.createElement("span");
  innerSpan1.classList.add("Button-content");

  const innerSpan2 = document.createElement("span");
  innerSpan2.classList.add("Button-label");

  const innerSpan3 = document.createElement("span");
  innerSpan3.classList.add("v-align-middle");
  innerSpan3.textContent = tag;

  innerSpan2.appendChild(innerSpan3);
  innerSpan1.appendChild(innerSpan2);
  a.appendChild(innerSpan1);

  return a
}

function checkStarredRepos() {
  const repoList = getSelectMenuList()
  console.log(`repoList: ${repoList.length}`)
  for (const repo of repoList) {
    getTags(repo)
      .then(({ tags, userId }) => {
        return tags.map((tag) => genButtom(tag, userId))
      })
      .then((spans) => {
        const starBtnGroup = repo.parentElement?.parentElement
        if (starBtnGroup === null || starBtnGroup === undefined) {
          return
        }
        const firstChild = starBtnGroup.firstElementChild;
        spans.forEach(span => {
          starBtnGroup.insertBefore(span, firstChild);
        });
      })
  }
}

checkStarredRepos()