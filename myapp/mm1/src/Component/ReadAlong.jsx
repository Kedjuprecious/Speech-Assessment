import React, { useState, useEffect, useRef } from 'react';
import Button from '../Component/Button';
import { useSpeech, SpeechProvider } from './context/SpeechContext';
import { getStory, gettoken} from './api';
import "./index.css"

const Readalong = () => {
    const { at, setToken, story, setStory, } = useSpeech();
    const [id, setId] = useState(0);
    const [start, setStart] = useState(false);
    const [stopf, setStop] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [pointsDiv, setPointsDiv] = useState([]);
    const [curSentence, setCurSentence] = useState("");
    const [curSentenceWordsLeft, setCurSentenceWordsLeft] = useState([]);
    const [curSentenceWordsDone, setCurSentenceWordsDone] = useState([]);
    const [nomatchFlag, setNomatchFlag] = useState(0);
    const reco = useRef(null);

    useEffect(() => {
      fetchToken();
    }, []);

    const fetchToken = async () => {
        try {
            const token = await gettoken();
            setToken(token);
        } catch (error) {
            console.error("Error fetching token:", error);
        }
    };

    useEffect(() => {
        fetchStory(id);
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

    const fetchStory = async (id) => {
      try {
          const data = await getStory(id);
        if(data.code == 200) {
           setStory(data.story);
           setCurSentence(data.story[0]);
           setCurSentenceWordsLeft(data.story[0].split(" "));
           setCurSentenceWordsDone([]);
          }
      } catch (error) {
        console.log(error);
        setCurSentence("--- THE END ---");
      }
    }

    const handleRecordClick = () => {
      if (stopf) {
        setStart(false);
        setStop(false);
        setTotalScore(0);
        setPointsDiv([]);
          setId(id + 1);
        
      } else if (start) {
            stoppingfunction();
        }
        else {
          setStart(true);
          getnextsentence();
            var prevwords = [];
            var audioConfig = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            
            var speechConfig;
            if (at) {
                speechConfig = window.SpeechSDK.SpeechConfig.fromAuthorizationToken(at, "centralindia");
            } else {
                console.log("authToken problem");
            }

            speechConfig.speechRecognitionLanguage = "en-IN";
           reco.current = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
           var phraseListGrammar = window.SpeechSDK.PhraseListGrammar.fromRecognizer(reco.current);
            phraseListGrammar.addPhrase(story);

            // Before beginning speech recognition, setup the callbacks to be invoked when an event occurs.

            // The event recognizing signals that an intermediate recognition result is received.
            // You will receive one or more recognizing events as a speech phrase