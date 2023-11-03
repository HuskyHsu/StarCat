function getSelectMenuList() {
  return [
    ...document.querySelectorAll(
      'div:not(.unstarred) details-menu.SelectMenu[role="menu"]'
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

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "octicon octicon-star-fill starred-button-icon d-inline-block");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M18.113 7.291h-6.279l-1.57-1.57H5.557c-.863 0-1.57.707-1.57 1.57v9.418c0 .863.707 1.57 1.57 1.57h12.557c.863 0 1.57-.707 1.57-1.57V8.86c0-.863-.707-1.57-1.57-1.57zm-1.617 8.633-2.307-1.35-2.307 1.35.612-2.613-2.033-1.758 2.676-.228 1.052-2.464 1.051 2.464 2.676.228-2.032 1.758.612 2.613z");
  svg.appendChild(path);
  a.appendChild(svg);

  const innerSpan = document.createElement("span");
  innerSpan.textContent = tag;

  a.appendChild(innerSpan);

  return a
}

function checkStarredRepos() {
  const repoList = getSelectMenuList()
  for (const repo of repoList) {
    getTags(repo)
      .then(({ tags, userId }) => {
        return tags.map((tag) => genButtom(tag, userId))
      })
      .then((spans) => {
        if (spans.length === 0) {
          return
        }

        const starBtnGroup = repo.parentElement?.parentElement
        if (starBtnGroup === null || starBtnGroup === undefined) {
          return
        }
        const firstChild = starBtnGroup.firstElementChild;
        if (firstChild?.tagName === 'A') {
          return
        }

        spans.forEach(span => {
          starBtnGroup.insertBefore(span, firstChild);
        });
      }).catch((err) => {
        console.log(err)
      })
  }
}

// checkStarredRepos()