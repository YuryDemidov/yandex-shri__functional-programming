/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  all,
  allPass,
  anyPass,
  complement,
  compose,
  converge,
  countBy,
  defaultTo,
  equals,
  flip,
  gte,
  identity,
  lt,
  max,
  prop,
  propEq,
  propSatisfies,
  reduce,
  values,
  where,
} from 'ramda';

import { COLORS, SHAPES } from '../constants';

const isEqualOne = equals(1);
const isEqualTwo = equals(2);
const lessThan = flip(lt);
const lessThanTwo = lessThan(2);
const notLessThan = flip(gte);
const notLessThanTwo = notLessThan(2);
const notLessThanThree = notLessThan(3);

const defaultToZero = defaultTo(0);

const getArrayMaxValue = reduce(max, 0);

const isRed = equals(COLORS.RED);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);
const isGreen = equals(COLORS.GREEN);
const isWhite = equals(COLORS.WHITE);

const isNotRed = complement(isRed);
const isNotBlue = complement(isBlue);
const isNotOrange = complement(isOrange);
const isNotGreen = complement(isGreen);
const isNotWhite = complement(isWhite);

const getColorsCountObj = compose(countBy(identity), values);

const getRed = prop([COLORS.RED]);
const getBlue = prop([COLORS.BLUE]);
const getOrange = prop([COLORS.ORANGE]);
const getGreen = prop([COLORS.GREEN]);
const getWhite = prop([COLORS.WHITE]);

const countRed = compose(defaultToZero, getRed, getColorsCountObj);
const countBlue = compose(defaultToZero, getBlue, getColorsCountObj);
const countOrange = compose(defaultToZero, getOrange, getColorsCountObj);
const countGreen = compose(defaultToZero, getGreen, getColorsCountObj);
const countWhite = compose(defaultToZero, getWhite, getColorsCountObj);

const getCircle = prop([SHAPES.CIRCLE]);
const getSquare = prop([SHAPES.SQUARE]);
const getTriangle = prop([SHAPES.TRIANGLE]);
const getStar = prop([SHAPES.STAR]);

const isTriangleGreen = propEq(SHAPES.TRIANGLE, COLORS.GREEN);

const isAllGreen = all(isGreen);
const isAllOrange = all(isOrange);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = where({
  [SHAPES.TRIANGLE]: isWhite(),
  [SHAPES.SQUARE]: isGreen(),
  [SHAPES.CIRCLE]: isWhite(),
  [SHAPES.STAR]: isRed(),
});

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(notLessThanTwo, countGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [countBlue, countRed]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = where({
  [SHAPES.SQUARE]: isOrange(),
  [SHAPES.CIRCLE]: isBlue(),
  [SHAPES.STAR]: isRed(),
});

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = allPass([
  compose(notLessThanThree, getArrayMaxValue, values, getColorsCountObj),
  compose(lessThanTwo, countWhite),
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isTriangleGreen,
  compose(isEqualTwo, countGreen),
  compose(isEqualOne, countRed),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(isAllOrange, values);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = propSatisfies(allPass([isNotRed, isNotWhite]), SHAPES.STAR);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(isAllGreen, values);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  converge(equals, [getTriangle, getSquare]),
  propSatisfies(isNotWhite, SHAPES.TRIANGLE),
]);
