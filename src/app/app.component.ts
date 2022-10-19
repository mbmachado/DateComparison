import { Component, OnInit } from '@angular/core';

// DateFns
import { add, getHours, parse, isLeapYear, isBefore } from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';
import { ptBR }from 'date-fns/locale';

// DayJs
import * as dayjs from 'dayjs';
import * as isLeapYearDayJs from 'dayjs/plugin/isLeapYear';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

//Luxon
import { DateTime } from "luxon";

//Temporal
import { Temporal } from '@js-temporal/polyfill';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    this.testDateFns();
    this.testDayJs();
    this.testLuxon();
    this.testTemporal();
  }

  testDateFns(): void {
    console.time("date-fns Time");

    const now = new Date();
    const hour = getHours(now);

    const nextWeek = add(now, { days: 7 });
    const nextWeekDateFormatted = format(nextWeek, "EEEE',' d MMMM',' HH:mm", { locale: ptBR });

    const zonedDate = utcToZonedTime(now, "America/Chicago");
    const zonedDateFormatted = format(zonedDate, "d.M.yyyy HH:mm:ss.SSS \'GMT\' XXX (z)", { timeZone: "America/Chicago" });

    const dateTimeParsing1 = parse("Jul 8, 2006", "MMM d, y", new Date());
    const dateTimeParsing2 = parse("2005-07-08", "y-MM-dd", new Date());

    const isDateBefore = isBefore(dateTimeParsing1, dateTimeParsing2);
    const isDateLeapYear = isLeapYear(now);

    console.timeEnd("date-fns Time");
    console.table({
      '|date-fns| hour:': hour,
      '|date-fns| nextWeek:': nextWeekDateFormatted,
      '|date-fns| zonedDateFormatted:': zonedDateFormatted,
      '|date-fns| isDateBefore:': isDateBefore,
      '|date-fns| isDateLeapYear:': isDateLeapYear,
    });
  }

  testDayJs(): void {
    console.time("dayJs Time");

    const now = new Date();
    const hour = dayjs(now).hour();

    const nextWeek = dayjs(now).add(7, 'day');
    const nextWeekDateFormatted = dayjs(nextWeek).locale('pt-br').format("dddd, MMMM D, ha");

    dayjs.extend(utc);
    dayjs.extend(timezone);

    const zonedDate = dayjs(now).tz("America/Chicago");
    const zonedDateFormatted = dayjs(zonedDate).format("dddd, MMMM D, ha");

    const dateTimeParsing1 = dayjs("Jul 8, 2006");
    const dateTimeParsing2 = dayjs("2005-07-08");

    dayjs.extend(isSameOrBefore);
    dayjs.extend(isLeapYearDayJs);

    const isDateBefore = dayjs(dateTimeParsing1).isSameOrBefore(dateTimeParsing2);;
    const isDateLeapYear = dayjs(now).isLeapYear();

    console.timeEnd("dayJs Time");
    console.table({
      '|dayjs| hour:': hour,
      '|dayjs| nextWeek:': nextWeekDateFormatted,
      '|dayjs| zonedDateFormatted:': zonedDateFormatted,
      '|dayjs| isDateBefore:': isDateBefore,
      '|dayjs| isDateLeapYear:': isDateLeapYear,
    });
  }

  testLuxon(): void {
    console.time("Luxon Time");

    const now = DateTime.now();
    const hour = now.hour;

    const nextWeek = now.plus({ days: 7 });
    const nextWeekDateFormatted = nextWeek.setLocale("pt-br").toFormat("EEEE',' MMMM d',' ha");

    const zonedDate = now.setZone("America/Chicago")
    const zonedDateFormatted = zonedDate.toFormat("dddd, MMMM D, ha");

    const dateTimeParsing1 = DateTime.fromFormat('Jul 8, 2006', 'MMM d, y');
    const dateTimeParsing2 = DateTime.fromFormat('2005-07-08', 'y-MM-dd');

    const isDateBefore = dateTimeParsing1 < dateTimeParsing2;
    const isDateLeapYear = now.isInLeapYear;

    console.timeEnd("Luxon Time");
    console.table({
      '|luxon| hour:': hour,
      '|luxon| nextWeek:': nextWeekDateFormatted,
      '|luxon| zonedDateFormatted:': zonedDateFormatted,
      '|luxon| isDateBefore:': isDateBefore,
      '|luxon| isDateLeapYear:': isDateLeapYear,
    });
  }

  testTemporal(): void {
    console.time("Temporal Time");

    let now = Temporal.Now.instant().toZonedDateTimeISO("America/Bahia");
    now = Temporal.Now.zonedDateTimeISO();
    const hour = now.hour;

    const nextWeek = now.add({ days: 7 });
    const timeFormat: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    };
    const nextWeekDateFormatted = nextWeek.toLocaleString("pt-br", timeFormat);

    const zonedDate = now.toInstant().toZonedDateTimeISO("America/Chicago");
    const zonedDateFormatted = zonedDate.toLocaleString("en", timeFormat);

    const dateTimeParsing1 = Temporal.PlainDateTime.from('2004-07-08');
    const dateTimeParsing2 = Temporal.PlainDateTime.from('2005-07-08');

    const isDateBefore = Temporal.PlainDate.compare(dateTimeParsing1, dateTimeParsing2) === -1;
    const isDateLeapYear = now.inLeapYear;

    console.timeEnd("Temporal Time");
    console.table({
      '|Temporal| hour:': hour,
      '|Temporal| nextWeek:': nextWeekDateFormatted,
      '|Temporal| zonedDateFormatted:': zonedDateFormatted,
      '|Temporal| isDateBefore:': isDateBefore,
      '|Temporal| isDateLeapYear:': isDateLeapYear,
    });
  }
}
