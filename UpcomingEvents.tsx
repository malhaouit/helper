import './UpcomingEvents.css'

import cyber_security from '../../assets/cyber_security.png'
import Artificial_intelligence from '../../assets/Artificial_intelligence.jpeg'
import Data_science from '../../assets/Data_science.jpg'
import Python_course from '../../assets/Python_course.jpg'
import { MdDateRange } from "react-icons/md";
import { TbClockHour10 } from "react-icons/tb";


const UpcomingEvents = () => {
  return (
    <div className='section-wrapper'>
       <div className='section-header'>
        <h4> Upcoming Events</h4>
       </div>
       <div className='UpcomingEvents-items'>
        <div className='UpcomingEvents-item'>
            <div className='card-wrapper'>
                <img className='UpcomingEvents-item-image' src={Artificial_intelligence}/>
                <div className='UpcomingEvents-item-content'>
                    <h4 className='UpcomingEvents-item-title'>
                        Artificial Intelligence course <br />
                        <span> Education</span>
                    </h4>
                    <ul>
                        <li><MdDateRange /> <span> 15 Sept 2024 </span></li>
                        <li><TbClockHour10 /><span> 9:00</span></li>
                    </ul>
                </div>
            </div>
        </div>
        {/* ... Repeat the event item structure for other events */}
       </div>

       {/* New Button Container */}
       <div className='UpcomingEvents-button-container'>
         <button className='more-events-button'>More Events</button>
       </div>
    </div>
  )
}

export default UpcomingEvents;
