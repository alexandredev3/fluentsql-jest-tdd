export class FluentSQLBuilder {
  #database = [];
  #limit = 0;
  #select = [];
  #where = [];
  #orderBy = '';

  constructor({ database }) {
    this.#database = database;
  }

  /**
   * nao vamos instaciar a classe pelo contructor,
   * quem quiser chamar vai ser pelo membro estatico for.
   */
  static for(database) {
    return new FluentSQLBuilder({ database });
  }

  limit(max) {
    // construindo o objeto da classe, sob demanda.
    this.#limit = max;

    // retornando o context para poder acessar os outros metodos pelo limit.
    return this;
  }

  select(props) {
    this.#select = props;

    return this;
  }

  where(query) {
    /**
     * Aqui foi tratar qualquer coisa que o usuasio passou.
     * seja uma regex ou uma string;
     */

    // chave e valor
    const [[propKey, selectedValue]] = Object.entries(query);
    // nesse formato: [["category", "dev"]]

    /**
     * vamos verficar se ele e uma expressao regular.
     * se nao for vamos transformar ele em uma expressao.
     */
    let whereFilter = new RegExp(selectedValue);

    if (selectedValue instanceof RegExp) {
      whereFilter = selectedValue;
    }

    this.#where.push({ propKey, filter: whereFilter });

    return this;
  }

  orderBy(field) {
    this.#orderBy = field;

    return this;
  }

  #performLimit(results) {
    // verificando se o limit foi usado.
    // verificando seu o results e mesmo tamanho do limit;
    return this.#limit && results.length === this.#limit;
  }

  #performWhere(item) {
    for(const { filter, propKey } of this.#where) {
      // se o filter não passar no teste do regex, ele tem que para a execução.
      if (!filter.test(item[propKey])) return false
    }

    return true;
  }

  #performSelect(item) {
    const currentItem = {};
    const entries = Object.entries(item);

    for(const [ key, value ] of entries) {
      /**
       * Verificando se tem alguma coisa no #select.
       * Verificando se o campo que usuario passou no select se encontra no #select.
       */
      if (this.#select.length && !this.#select.includes(key)) continue;

      currentItem[key] = value;
    };

    return currentItem;
  }

  #performOrderBy(results) {
    // se ninguem passou, retorna tudo.
    if (!this.#orderBy) return results;

    return results.sort((prev, next) => {
      return prev[this.#orderBy].localeCompare(next[this.#orderBy]);
    })
  }

  /**
   * Nossa factory, e onde retorna a instacia do nosso objeto.
   */
  build() {
    // quem vai fazer o trabalho pesado e o build.
    // ele ira retornar o resultado final.

    const results = [];

    for(const item of this.#database) {
      // se retornar false, e porque o filtro que foi passado não foi encontrado.
      if (!this.#performWhere(item)) continue;

      const currentItem = this.#performSelect(item);

      results.push(currentItem);

      // se retornar true e porque acabou o limite.
      if (this.#performLimit(results)) break;
    }

    const finalResult = this.#performOrderBy(results);

    return finalResult;
  }
}