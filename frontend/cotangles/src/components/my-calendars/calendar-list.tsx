import * as React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { CardCalendarInvite } from "./calendar-invite";
// import { CalendarDelete } from "./calendar-delete";
// import { CalendarLeave } from "./calendar-leave";


// Components specifically related to the my calendar page
export type CalendarProp = {
  calendarName: string; 
  calendarId: string;
};

export type CalendarSetter = (calendarToAdd: CalendarProp) => void

const CardBodyCalendar = () => {
  const [calendarList, setCalendarList] = React.useState<CalendarProp[]>([
    { calendarName: "Test Calendar", calendarId: "6cd6b53c-b84b-43c1-bab4-79cc98770a7d" },
    { calendarName: "CS Alliance", calendarId: "yourmother" },
    { calendarName: "COMM1140 Team", calendarId: "asdasd" },
  ])

  // probably better to just add it separately on the frontend and backend than
  // send it to backend and wait for frontend to update
  const addCalendarToList = (calendarToAdd: CalendarProp) => {
    // add to frontend
    setCalendarList(calendarList => [...calendarList, calendarToAdd])
    // todo: add calendar to backend
  }

  // invite accepted -> add calendar to list
  // give setter to invite
  // give variable to calendar list
  // const removeCalendarFromlist = (calendarToRemove: CalendarProp) => {
  //   setCalendarList(calendarList.filter(calendar => calendar !== calendarToRemove))
  // }
  // prop passed into MyCalendar removeCalendar={removeCalendarFromlist}

  return(
    <div className="flex flex-wrap justify-start rounded-[2.5em] bg-transparent text-black w-[70vw] h-[85%] p-5 gap-x-[5%] gap-y-[10%] overflow-auto">
      <CardCalendarInvite addCalendar={addCalendarToList}/>
      <MyCalendarList calendarList={calendarList}/>
    </div>
  )
}

type MyCalendarListProps = {
  calendarList: CalendarProp[], 
  // removeCalendar:CalendarSetter
}
  const MyCalendarList = ({ calendarList }: MyCalendarListProps ) => {
    const navigate = useNavigate()
    const navigateToCalendar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, calendar: CalendarProp) => {
      if (e.currentTarget !== e.target) return;
      navigate(`./${calendar.calendarId}`)
    }
    return (
      <>
      {calendarList.map((calendar) => (
        <Button onClick={(e) => {navigateToCalendar(e, calendar)}} key={calendar.calendarId} className="flex flex-col items-center justify-around rounded-[2.5em] shadow-light border-2 border-border bg-secondary text-black w-[30%] h-[70%] p-5 text-center" >
            <h1 className="break-words w-full">{calendar.calendarName}</h1>
            {/* <div className="flex w-full justify-center gap-x-[10%]">
              <CalendarLeave calendar={calendar} removeCalendar={removeCalendar}/>
              <CalendarDelete calendar={calendar} removeCalendar={removeCalendar}/>
            </div> */}
            {/* Could add something here like a calendar / person preview , also calendar settings (leave calendar and whatnot) */}
        </Button>
      ))}
      </>
    );
};


export {
    MyCalendarList,
    CardBodyCalendar
}