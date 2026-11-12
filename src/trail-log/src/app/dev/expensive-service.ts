export class ExpensiveService {
  constructor() {
    console.log('Expensive service started');
  }
}
// NewExepensiveService : ExpensiveService
export class NewExpensiveService implements ExpensiveService {
  constructor() {
    console.log('The new version is started service started');
  }
}
