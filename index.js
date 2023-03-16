import escapeHtml from './src/utils/escape-html.js';

const URL = 'https://api.github.com/search/repositories?';

export default class SearchSection {
  URL = 'https://api.github.com/search/repositories?'
  element;
  formElements;
  subElements;
  messageElements;
  formData = {}
  formIsValid;

  fetchData = async (value) => {
    let url = this.URL.toString() + `q=${value}+in:name`;

    // let error;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error();
      }

      const result = await response.json();

      return (result);
    } catch (err) {
      console.log(err.message);
      // error = "No results";
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()

    this.formIsValid = this.checkValidationFrom()

    if (this.formIsValid) {
      await this.updateResult()
    }
  }

  constructor() {
    this.render()
  }

  onInput = (event) => {
    const elementName = event.target.dataset.formelement
    const target = event.target
    this.formData[elementName] = target.value

    this.setValid()

    // console.log(this.element)
    // console.log(this.formElements)
    console.log(this.subElements)
    // console.log(this.messageElements)
    console.log(this.formData)
    // console.log(this.formIsValid);
  }

  render() {
    this.element = this.getElement()
    this.formElements = this.getSubElements(this.element, 'formelement')
    this.subElements = this.getSubElements(this.element, 'subelement')
    this.messageElements = this.getSubElements(this.element, 'messageelement')

    this.initListeners()

    return this.element
  }

  async updateResult() {
    this.reset()
    await this.loadResult()

    console.log('submit', this.fetchResult)
    this.showResults()
  }

  async loadResult() {
    this.subElements.result.classList.add("loading")
    this.fetchResult = await this.fetchData(this.formData.search);
    this.subElements.result.classList.remove("loading")
  }

  showResults() {
    for (const key in this.fetchResult.items) {
      const data = this.fetchResult.items[key]
      const elem = this.getResultCardElement(data)

      this.subElements.result.append(elem)
    }
  }

  checkSearch(elem) {
    let valid = false

    const min = 3,
      max = 150;

    const search = elem.value.trim();

    if (this.isEmpty(search)) {
      this.showMessage(elem, 'the search query cannot be empty');
    } else if (!this.isBetween(search.length, min, max)) {
      this.showMessage(elem, `the search query must be between ${min} and ${max} characters.`)
    } else {
      this.showMessage(elem);
      valid = true;
    }

    return valid;
  }

  showMessage(input, message = '') {
    const elementName = input.dataset.formelement

    const error = this.messageElements[elementName]
    error.textContent = message;
  };

  reset() {
    this.formReset()
    this.clearResult()
    this.resetMessages()
  }

  resetMessages() {
    for (const elementName in this.messageElements) {
      this.messageElements[elementName].textContent = '';
    }
  }

  formReset() {
    this.subElements.searchForm.reset()
    this.setValid()
  }

  clearResult() {
    this.subElements.result.innerHTML = '';
  }

  setValid() {
    this.formIsValid = this.checkValidationFrom()
    this.toggleSubmitButton()
  }

  checkValidationFrom() {
    const isSearchValid = this.checkSearch(this.formElements.search)

    return isSearchValid
  }

  toggleSubmitButton() {
    this.subElements.formButton.disabled = !this.formIsValid
  }

  initListeners() {
    this.subElements.searchForm.addEventListener('submit', this.onSubmit)
    this.formElements.search.addEventListener('input', this.onInput)
  }

  getResultCardElement(data) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getResultCardTemplate(data);

    return wrapper.firstElementChild;
  }


  getElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    return wrapper.firstElementChild;
  }

  getSubElements(element, datasetName) {
    const result = {};
    const elements = element.querySelectorAll(`[data-${datasetName}]`)

    for (const subElement of elements) {
      const name = subElement.dataset[datasetName]
      result[name] = subElement
    }

    return result;
  }

  getResultCardTemplate(data) {
    return `
    <div class="result-wrapper__result-item result-item">
      <div class="result-item__title-wrapper">
          <a class="result-item__name" href=${data.html_url}>💾${data.full_name}</a>
          <p class="result-item__date">Updated ${this.formatDate(data.updated_at)}</p>
      </div>
      <p class="result-item__description">${(data.description) ? data.description : ''}</p>
      <div class="result-item__count-wrapper">
        <div class="result-item__stars">
          <span>⭐ Stars</span> ${data.stargazers_count}
        </div>
        <div class="result-item__borderline borderline"></div>
        <div class="result-item__forks">
          <span>📝 Forks</span> ${data.forks_count}
        </div>
      </div>
    </div>
  `
  }

  getTemplate() {
    return `
    <div class="search">
      <form class="search__form form" action="" data-subelement="searchForm">
        
          <div  class="form__search-field form-field">
            <input class="form__username form-field__field" value="" autocomplete="off" maxlength="30" autofocus placeholder="Search GitHub repository..." type="text" data-formelement="search" />
            <small data-messageelement="search" class="form-field__message"></small>

            <button class="form-field__button-submit button" type="submit" disabled aria-pressed="false" data-subelement="formButton">
              <svg fill="#000000" height="26px" width="26px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 490.4 490.4" xml:space="preserve">
                <g>
                  <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796
                    s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z
                      M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"/>
                </g>
              </svg>
            </button>

          </div>
      
        </form>
      <div class="search__result-wrapper result-wrapper" data-subelement="result"></div>

    </div>
    `
  }

  formatDate(dateStr) {
    const date = new Date(dateStr)

    const day = this.formatDateSegment(date.getDate()),
      month = this.formatDateSegment(date.getMonth() + 1),
      year = date.getFullYear()

    return `on ${day}.${month}.${year}`
  }

  formatDateSegment(dateSegment) {
    return (dateSegment < 10) ? '0' + dateSegment : dateSegment
  }

  isEmpty = (value) => value === '' ? true : false

  isBetween = (length, min, max) => (length < min || length > max) ? false : true

  remove() {
    if (this.element) {
      this.element.remove()
    }
  }

  destroy() {
    this.remove()
    this.element = null
  }
}