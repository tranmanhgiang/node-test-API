import { Response } from 'express';
import { Parser } from 'json2csv';

export const exportCsv = (res: Response, fileName: string, fields: { label: string; value: string }[], data) => {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);
};

export const convertSecondToMinuteSecond = (value: number) => {
    const minutes = Math.trunc(value / 60) >= 100 ? `0${Math.trunc(value / 60)}`.slice(-3) : `0${Math.trunc(value / 60)}`.slice(-2);
    const seconds = `0${Math.trunc(value % 60)}`.slice(-2);
    return `${minutes}:${seconds}`;
};
