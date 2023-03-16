const BASE_API_URL = 'https://api.github.com';
const REPO_SEARCH_PATH = '/search/repositories?'
const RESULT_COUNT = 10;

export default class SearchSection {
  element;
  formElements;
  subElements;
  messageElements;
  url;
  formData = {}
  formIsValid;

  fetchData = async (value) => {
    const query =  `q=${value}+in:name`;

    this.url = new URL(REPO_SEARCH_PATH + query, BASE_API_URL)
    this.url.searchParams.set('per_page', RESULT_COUNT)
    this.url.searchParams.set('sort', 'stars')
    
    try {
      const response = await fetch(this.url);

      if (!response.ok) {
        throw new Error();
      }

      const result = await response.json();

      return (result);
    } catch (err) {
      console.error(err.message);
    }
  }

  onInput = (event) => {
    const elementName = event.target.dataset.formelement
    const target = event.target
    this.formData[elementName] = target.value

    this.setValid()
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

  render() {
    this.element = this.getElement()
    this.formElements = this.getSubElements(this.element, 'formelement')
    this.subElements = this.getSubElements(this.element, 'subelement')
    this.messageElements = this.getSubElements(this.element, 'messageelement')

    this.initListeners()

    return this.element
  }

  initListeners() {
    this.subElements.searchForm.addEventListener('submit', this.onSubmit)
    this.formElements.search.addEventListener('input', this.onInput)
  }

  async updateResult() {
    this.reset()
    await this.loadResult()
    this.showResults()
  }

  async loadResult() {
    this.subElements.result.classList.add('search__loading', 'loading')
    this.fetchResult = await this.fetchData(this.formData.search);
    this.subElements.result.classList.remove('search__loading', 'loading')
  }

  showResults() {
    if (this.fetchResult.items.length) {
      for (const key in this.fetchResult.items) {
        const data = this.fetchResult.items[key]
        const elem = this.getResultCardElement(data)

        this.subElements.result.append(elem)
      }
    } else {
      const elem = this.getEmptyResultElement()
      this.subElements.result.append(elem)
    }

  }

  getEmptyResultElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getEmptyResultTemplate();

    return wrapper.firstElementChild;
  }

  checkSearch(elem) {
    let valid = false

    const min = 3,
      max = 200;

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

  resetMessages() {
    for (const elementName in this.messageElements) {
      this.messageElements[elementName].textContent = '';
    }
  }

  reset() {
    this.clearResult()
    this.resetMessages()
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

  getElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    return wrapper.firstElementChild;
  }

  getResultCardElement(data) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getResultCardTemplate(data);

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

  getTemplate() {
    return `
    <div class="search">
      <form class="search__form form" action="" data-subelement="searchForm">
          <div  class="form__search-field form-field">
            <input class="form__username form-field__field" value="" autocomplete="off" maxlength="30" autofocus placeholder="Search GitHub repository..." type="text" data-formelement="search" />
            <small data-messageelement="search" class="form-field__message"></small>
            <button class="form-field__button-submit button" type="submit" disabled aria-pressed="false" data-subelement="formButton">
              <svg fill="#000000" height="26px" width="26px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
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
      <div class="search__result-wrapper result-wrapper" data-subelement="result">
        <div class="result-item__info info">
          <div class="info__icon">👋</div>
          <p class="info__content">Enter a search query to see the 10 most suitable repositories</p>
        </div>
      </div>
    </div>
    `
  }

  getResultCardTemplate(data) {
    const bodyIsEmpty = !data.description && !data.stargazers_count && !data.forks_count && !data.language

    return `
    <div class="result-wrapper__result-item result-item">
      <div class="result-item__title-wrapper">
          <a class="result-item__name" target="_blank" rel="noopener noreferrer" href=${data.html_url}>
            ${data.full_name}
          </a>
          <p class="result-item__date">Updated ${this.formatDate(data.updated_at)}</p>
      </div>
      ${(!bodyIsEmpty) 
      ? `
        <div class="result-item__body">
          <p class="result-item__description">${(data.description) ? data.description : ''}</p>
          ${this.getCountWrapper(data)}
        </div>
        `
      : ''}
    </div>
  `
  }

  getEmptyResultTemplate() {
    return `
    <div class="result-item__info info">
      <svg class="info__icon" fill="#000000" height="26px" width="26px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
      viewBox="0 0 490.4 490.4" xml:space="preserve">
        <g>
          <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796
            s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z
              M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"/>
        </g>
      </svg>
      <p class="info__content">We couldn’t find any repositories matching '${this.formData.search}' </p>
    </div>
    `
  }

  getCountWrapper(data) {
    const countersIsEmbty = !data.stargazers_count && !data.forks_count && !data.language

    if (countersIsEmbty) return ''

    return `
    <div class="result-item__count-wrapper">
      ${this.getStarsHTML(data.stargazers_count)}
      ${this.getForksHTML(data.forks_count)}
      ${this.getLanguageHTML(data.language)}
    </div>
    `
  }

  getStarsHTML(stars) {
    if (!stars) return ''

    return `
    <div class="result-item__stars count-element count-element__stars">
      <span class="count-element__icon">⭐</span> ${stars}
    </div>
    `
  }

  getForksHTML(forks) {
    if (!forks) return ''

    return `
    <div class="result-item__forks count-element count-element__forks">
      <span class="count-element__icon">
      <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 5.74028 10.5978 6.38663 10 6.73244V14.0396H11.7915C12.8961 14.0396 13.7915 13.1441 13.7915 12.0396V10.7838C13.1823 10.4411 12.7708 9.78837 12.7708 9.03955C12.7708 7.93498 13.6662 7.03955 14.7708 7.03955C15.8753 7.03955 16.7708 7.93498 16.7708 9.03955C16.7708 9.77123 16.3778 10.4111 15.7915 10.7598V12.0396C15.7915 14.2487 14.0006 16.0396 11.7915 16.0396H10V17.2676C10.5978 17.6134 11 18.2597 11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 18.2597 7.4022 17.6134 8 17.2676V6.73244C7.4022 6.38663 7 5.74028 7 5Z" fill="#ffffff"/>
      </svg>
      </span> ${forks}
    </div>
    `
  }

  getLanguageHTML(language) {
    if (!language) return ''

    return `
    <div class="result-item__language count-element count-element__language">
      <span class="count-element__icon">🌐</span> ${language}
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