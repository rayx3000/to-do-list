import { projects } from './data.js';
import { isToday, isThisWeek, parseISO } from 'date-fns';

let allTasks = projects.flatMap(project => project.content);

export let home = allTasks;

export let days = allTasks.filter(task => {
    if (!task.date) return false;
    const taskDate = parseISO(task.date);
    return isToday(taskDate);
});

export let weekly = allTasks.filter(task => {
    if (!task.date) return false;
    const taskDate = parseISO(task.date);
    return isThisWeek(taskDate, { weekStartsOn: 1 }); // Assuming week starts on Monday
});
