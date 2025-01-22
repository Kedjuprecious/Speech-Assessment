import React from 'react';

const DetailedTable = ({ words }) => {
    return (
        <div id="detailedtable">
            <table>
                <tr id="wordrow">
                    {words.map((w, wi) => (
                        w.ErrorType === "Omission" ?
                            <td key={wi} style={{ backgroundColor: "orange" }}> {w.Word} </td> :
                            w.ErrorType === "Insertion" ?
                                <td key={wi} style={{ display: 'none' }} > {w.Word} </td> :

                                <td key={wi} colSpan={w.Phonemes.length} style={{ backgroundColor: w.ErrorType === "None" ? "lightgreen" : "red" }}>
                                    {w.Word}
                                    <sup>{w.AccuracyScore}</sup>
                                </td>
                    ))}
                </tr>
                <tr id="phonemerow">
                    {words.map((w, wi) => (
                        w.ErrorType === "Omission" ?
                            <td key={`ph-${wi}`}> - </td> :
                             w.ErrorType === "Insertion" ?
                                 <td key={`ph-${wi}`} style={{ display: 'none' }}> - </td>:
                            w.Phonemes.map((p, phonei) => (
                            <td key={`phone-${wi}-${phonei}`} style={{
                                backgroundColor: p.AccuracyScore >= 80 ? 'green' :
                                    p.AccuracyScore >= 60 ? 'lightgreen' :
                                        p.AccuracyScore >= 40 ? 'yellow' : 'red'
                            }} >{p.Phoneme}</td>
                            ))
                    ))}
                </tr>
                <tr id="scorerow">
                    {words.map((w, wi) => (
                        w.ErrorType === "Omission" ?
                            <td key={`sc-${wi}`}> - </td>:
                            w.ErrorType === "Insertion" ?
                             <td key={`sc-${wi}`} style={{ display: 'none' }}> - </td>:

                            w.Phonemes.map((p, phonei) => (
                                <td key={`score-${wi}-${phonei}`}>{p.AccuracyScore}</td>
                            ))
                    ))}
                </tr>
            </table>
        </div>
    );
};

export default DetailedTable;