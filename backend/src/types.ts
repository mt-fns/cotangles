import { ObjectId } from 'mongodb';

export interface UserToken {
    userId: string,
    email: string
}

export interface CalendarData {
    id: number,
    title: string,
    start: Date,
    end: Date
}

export interface CalendarList {
    calendarName: string,
    calendarId: string
}

export interface User{
    _id: ObjectId;
    userId: string;
    googleId: string,
    email: string,
    name: string,
    ical: string,
    calendarData: CalendarData[],
    calendars: CalendarList[],
    invites: CalendarList[]
};

export interface CalendarUserData {
    userId: string,
    name: string,
    calendarData: CalendarData[],
}

export interface CalendarInfo {
    calendarId: string,
    name: string,
    userList: UserList[],
    calendarUserData: CalendarUserData[]
}

export interface UserList {
    userId: string,
    color: string
}

export interface Calendar {
    _id: ObjectId;
    calendarId: string;
    userList: UserList[];
    name: string;
}