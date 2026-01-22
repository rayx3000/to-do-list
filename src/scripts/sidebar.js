import { projects } from './data.js';
import { isToday, isThisWeek, parseISO } from 'date-fns';

const getTasks = () => projects.flatMap(project => project.content);

export const getHomeTasks = () => getTasks();

export const getTodayTasks = () => getTasks().filter(task => {
    if (!task.date) return false;
    const taskDate = parseISO(task.date);
    return isToday(taskDate);
});

export const getWeeklyTasks = () => getTasks().filter(task => {
    if (!task.date) return false;
    const taskDate = parseISO(task.date);
    return isThisWeek(taskDate, { weekStartsOn: 1 }); 
});
