/**
 * @author JinHao Li, Ethan Sengsavang
 *
 * @version 2021.07.21 - Copied from index.js
 * @since 2021.07.21
 */

            
function ElogDateTime({ selected, handleChange }) {
    // const [date, setDate] = useState(selected && selected.split(" ")[0]);
    // const [time, setTime] = useState(selected && selected.split(" ")[1]);

    var today = new Date()
    
    if (today.getMonth() < 9){
        var currentDate = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
    } else {
        var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }
    var currentTime = today.getHours() + ':' + today.getMinutes();
    var dateTime = currentDate + " " + currentTime;

    const [date, setDate] = useState(currentDate);
    const [time, setTime] = useState(currentTime);

    const dateRef = useRef(null);
    const timeRef = useRef(null);

    useEffect(() => {
        if (!date || !time) return;
    }, [date, time]);

    function _handleChange(e) {
        // onChange();
        const value = e.target.value;
        const elid = e.target.id;
        let newStr;

        if ("elogdate" === elid) {
            setDate(value);
            newStr = new String("").concat(value || "0000-00-00", " ", time || "00:00");
        } else if ("elogtime" === elid) {
            setTime(value);
            newStr = new String("").concat(date || "0000-00-00", " ", value || "00:00");
        }
        handleChange(newStr);
        console.log(newStr)
    }

    return (
        <div className='auction-date-time'>
            <div className='auction-date'>
                <input
                    id="elogdate"
                    ref={dateRef}
                    value={date}
                    onChange={_handleChange}
                    type="date"
                    min="2000-01-01"
                />
            </div>
            <div className="auction-time">
                <input
                    id="elogtime"
                    ref={timeRef}
                    value={time}
                    onChange={_handleChange}
                    type="time"
                />
            </div>
        </div>
    );
}

export default ElogDateTime;
