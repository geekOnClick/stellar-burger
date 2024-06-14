describe('Добавление ингредиентов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');

    cy.get('[data-cy=bun-ingredients]').as('bunIngredients');
    cy.get('[data-cy=mains-ingredients]').as('mainsIngredients');
    cy.get('[data-cy=constructor-ingredients]').as('constructorIngredients');
    cy.get('[data-cy=sauces-ingredients]').as('saucesIngredients');
  });

  it('Добавляет ингредиент', () => {
    cy.get('@bunIngredients').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]').as('constructorBun1');
    cy.get('[data-cy=constructor-bun-2]').as('constructorBun2');

    cy.get('@constructorBun1').contains('Ингредиент 1').should('exist');
    cy.get('@constructorBun2').contains('Ингредиент 1').should('exist');

    cy.get('@mainsIngredients').contains('Добавить').click();
    cy.get('@constructorIngredients').contains('Ингредиент 2').should('exist');

    cy.get('@saucesIngredients').contains('Добавить').click();
    cy.get('@constructorIngredients').contains('Ингредиент 4').should('exist');
  });
});

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('Открывает модальное окно', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Ингредиент 1').should('exist');
  });

  it('Закрывает модальное окно по клику на иконку закрыть', () => {
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals button[aria-label="Закрыть"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Закрывает модальное окно по клику на overlay', () => {
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal_overlay]').click('left', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Модальное окно заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );

    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit('/');

    cy.get('[data-cy=bun-ingredients]').as('bunIngredients');
    cy.get('[data-cy=mains-ingredients]').as('mainsIngredients');
    cy.get('[data-cy=constructor-ingredients]').as('constructorIngredients');
    cy.get('[data-cy=sauces-ingredients]').as('saucesIngredients');
    cy.get('[data-cy=constructor]').as('constructor');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Заказывает бургер и закрывает модальное окно', () => {
    cy.get('@bunIngredients').contains('Добавить').click();
    cy.get('@mainsIngredients').contains('Добавить').click();
    cy.get('@saucesIngredients').contains('Добавить').click();
    cy.get('[data-cy=order-summ] button').click();

    cy.wait('@postOrder').then(() => {
      cy.get('@postOrder')
        .its('response.body.order.ingredients')
        .should('deep.equal', ['1', '2', '4', '1']);

      cy.get('[data-cy=order-number]').contains('11111').should('exist');
    });

    cy.get('#modals button[aria-label="Закрыть"]').click();
    cy.get('[data-cy=order-number]').should('not.exist');

    cy.get('@constructor').contains('Ингредиет 1').should('not.exist');
    cy.get('@constructor').contains('Ингредиет 2').should('not.exist');
    cy.get('@constructor').contains('Ингредиет 4').should('not.exist');
  });
});
