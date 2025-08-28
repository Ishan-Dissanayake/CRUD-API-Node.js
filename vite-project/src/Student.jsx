import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

function Student() {

    const [student, setStudent] =useState([]) 
    useEffect(() => {
       
        axios.get('http://localhost:8081/')
            .then(res => setStudent(res.data))
            .catch(err => console.log(err));
    }, []);
    
    const StudentDelete =async (id) => {
        try{
            await axios.delete('http://localhost:8081/student/'+id)
            window.location.reload()
        }catch(err){
            console.log(err);
        }
    }

//xdssdsdsdsdsdsd
//home sxsssweawewewesswesdsdfdsdfdsaasfaasdsawdfdfeewtesdweszssdsd
// sdfsdfzxxssweewsaaaewtttttsasasssaxcsdssasawesasaszxqaxcsaaszxzzxcxxcxczxcfger
    return (
        <div className='d-flex vh-100 vw-100 bg-primary justify-content-center align-items-center'>
          
            <h1>Student Email</h1>
        
             <div className='w-50% bg-white rounded p-3'>
                <Link to="/create" className='btn btn-success mb-3'>Add +</Link>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                            student.map((data, i)=>(
                                <tr key={i}>
                                    <td>{data.sname}</td>
                                    <td>{data.semail}</td>
                                    <td>
                                <Link to={`update/${data.id}`} className='btn btn-primary'>Update Details</Link>
                                <button className='btn btn-danger ms-2' onClick={e => StudentDelete(data.id) }>Delete Student Details</button>
                            </td>
                                </tr>
                            ))
                        }
                      
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Student;
