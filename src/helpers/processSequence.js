/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import {
  __,
  allPass,
  andThen,
  assoc,
  compose,
  gt,
  ifElse,
  length,
  lt,
  modulo,
  otherwise,
  prop,
  replace,
  split,
  tap,
  test,
} from 'ramda';

import Api from '../tools/api';

const api = new Api();

const isFloatNumSymbols = test(/^[\d.]*$/);
const splitOnDot = split('.');
const hasNoDotRepetition = compose(lt(__, 3), length, splitOnDot);

const isValidInput = allPass([
  compose(gt(__, 2), length),
  compose(lt(__, 10), length),
  isFloatNumSymbols,
  hasNoDotRepetition,
]);

const validate = ifElse(
  isValidInput,
  (value) => Promise.resolve(value),
  () => Promise.reject('Validation Error')
);

const toNumber = compose(Math.round, Number);

const getResultProp = prop('result');
const requestBinary = compose(
  andThen(getResultProp),
  api.get('https://api.tech/numbers/base'),
  assoc('number', __, { from: 10, to: 2 })
);

const squareNumber = (value) => value ** 2;

const getDivideByThreeReminder = modulo(__, 3);

const requestAnimal = compose(
  andThen(getResultProp),
  api.get(__, {}),
  replace('{id}', __, 'https://animals.tech/{id}')
);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = tap(writeLog);

  compose(
    otherwise(handleError),
    andThen(handleSuccess),
    andThen(requestAnimal),
    andThen(log),
    andThen(getDivideByThreeReminder),
    andThen(log),
    andThen(squareNumber),
    andThen(log),
    andThen(length),
    andThen(log),
    andThen(requestBinary),
    andThen(log),
    andThen(toNumber),
    validate,
    log
  )(value);
};

export default processSequence;
