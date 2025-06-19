// src/utils/SearchBuilder.ts
export class SearchBuilder<T> {
  private query: any = {};
  private currentCondition: any = null;
  private currentLogicalOperator: '$and' | '$or' | null = null;

  static create<T>() {
    return new SearchBuilder<T>();
  }

  where(field: keyof T): SearchBuilder<T> {
    this.currentCondition = { field };
    return this;
  }

  and(field: keyof T): SearchBuilder<T> {
    if (!this.query.$and) this.query.$and = [];
    this.currentCondition = { field };
    this.currentLogicalOperator = '$and';
    return this;
  }

  or(field: keyof T): SearchBuilder<T> {
    if (!this.query.$or) this.query.$or = [];
    this.currentCondition = { field };
    this.currentLogicalOperator = '$or';
    return this;
  }

  equals(value: any): SearchBuilder<T> {
    this.addCondition('$eq', value);
    return this;
  }

  notEquals(value: any): SearchBuilder<T> {
    this.addCondition('$ne', value);
    return this;
  }

  contains(value: string): SearchBuilder<T> {
    this.addCondition('$regex', value);
    return this;
  }

  in(values: any[]): SearchBuilder<T> {
    this.addCondition('$in', values);
    return this;
  }

  notIn(values: any[]): SearchBuilder<T> {
    this.addCondition('$nin', values);
    return this;
  }

  greaterThan(value: number | Date): SearchBuilder<T> {
    this.addCondition('$gt', value);
    return this;
  }

  greaterThanOrEqual(value: number | Date): SearchBuilder<T> {
    this.addCondition('$gte', value);
    return this;
  }

  lessThan(value: number | Date): SearchBuilder<T> {
    this.addCondition('$lt', value);
    return this;
  }

  lessThanOrEqual(value: number | Date): SearchBuilder<T> {
    this.addCondition('$lte', value);
    return this;
  }

  exists(value: boolean): SearchBuilder<T> {
    this.addCondition('$exists', value);
    return this;
  }
  /**
   * Performs case-insensitive pattern matching
   * @param value - The pattern to match (use % as wildcard)
   * @example 
   *   .where('name').like('%john%') // contains "john"
   *   .where('name').like('john%') // starts with "john"
   *   .where('name').like('%john') // ends with "john"
   */
  like(value: string): SearchBuilder<T> {
    if (typeof value !== 'string') {
      throw new Error('Like operator requires a string value');
    }
    
    const regexPattern = value
      .replace(/%/g, '.*')  // Convert SQL-like % to regex .*
      .replace(/_/g, '.');  // Convert SQL-like _ to regex .
    
     this.addCondition('$regex', new RegExp(`^${regexPattern}$`, 'i'));
    return this;
  }

  /**
   * Case-sensitive pattern matching
   * @param value - The pattern to match (use % as wildcard)
   */
  likeCaseSensitive(value: string): SearchBuilder<T> {
    if (typeof value !== 'string') {
      throw new Error('Like operator requires a string value');
    }
    
    const regexPattern = value
      .replace(/%/g, '.*')
      .replace(/_/g, '.');
    
     this.addCondition('$regex', new RegExp(`^${regexPattern}$`));
     return this;
  }

  build() {
    return this.query;
  }

  private addCondition(operator: string, value: any) {
    if (!this.currentCondition) {
      throw new Error('No field specified. Call where() first.');
    }

    const condition = {
      [this.currentCondition.field]: { [operator]: value }
    };

    if (this.currentLogicalOperator) {
      this.query[this.currentLogicalOperator] = [
        ...(this.query[this.currentLogicalOperator] || []),
        condition
      ];
    } else {
      this.query = { ...this.query, ...condition };
    }

    this.currentCondition = null;
  }
}