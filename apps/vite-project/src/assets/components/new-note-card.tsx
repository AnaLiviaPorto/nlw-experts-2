import * as Dialog from '@radix-ui/react-dialog'
import { X }from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import {toast} from 'sonner'

interface NewNoteCardProps{
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps) {
  const [shouldShowOnBoarding, setshouldShowOnBoarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStarEditor(){
    setshouldShowOnBoarding(false)
    console.log()
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === ''){
      setshouldShowOnBoarding(true)
    }
  }
  function handleSaveNote(event:  FormEvent) {
    event.preventDefault()

    if (content === ''){
      return

    }

    onNoteCreated(content)
    setContent('')
    setshouldShowOnBoarding(true)
    toast.success('Nota criada com sucesso')
    
  }

  function handleStarRecording(){
    

    const isSpeechRecognitionApiAvailable = 'SpeechRecognition' in window
    || 'webkitSpeechRecognition' in window


    if (!isSpeechRecognitionApiAvailable){
      alert('Infelizmente seu navegador não suporta a API de gravação!')
      return 
    }

    setIsRecording(true)
    setshouldShowOnBoarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
       }, '') 

       setContent(transcription)

    }

    speechRecognition.onerror = (event) => {
      console.error(event)

    }

    speechRecognition.start()


  }

  function handleStopRecording(){
    setIsRecording(false)

    if (SpeechRecognition != null){
      speechRecognition?.stop()

    }
    

  }

    return(
      
        <Dialog.Root>
          <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400"> 
            <span className="text-sm font-medium text-slate-300">
              Adicionar Nota
            </span>
            <p className="text-sm leading-6 text-slate-400">
            Grave uma nota em áudio que será convertida para texto automaticamente.
           </p>

            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none"/>
          
          </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50"/>
                <Dialog.DialogContent className="fixed ouverflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounder-md flex flex-col outline-none">
                  <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                    <X className="size-5"/>
                  </Dialog.Close>

                  <form className="flex-1 flex flex-col">
                      <div className="flex flex-1 flex-col gap-3 p-5 ">
                        <span className="text-sm font-medium text-slate-300">
                          Adicionar Nota
                        </span>

                      {shouldShowOnBoarding ? ( 
                        <p className="text-sm leading-6 text-slate-400">
                          Comece <button type='button' onClick={handleStarRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em aúdio ou se preferir <button type='button' onClick={handleStarEditor} className="font-medium text-lime-400 hover:underline"> utilize apenas texto</button>
                        </p> 
                        ) : (
                          <textarea
                          autoFocus
                          className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                          onChange={handleContentChanged}
                          value={content}/>
                          
                        )}
                      </div>

                      {isRecording ? ( <button onClick={handleStopRecording}
                      type="button"
                      className="w-full flex items-center justify-center gap-1 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                      >
                        <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
                        Gravando! (click p/ interromper)

                      </button>
                      ) : (

                      <button onClick={handleSaveNote}
                      type="button"
                      className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                      >
                        Salvar Nota

                      </button>

                      )}

                  </form>
                </Dialog.DialogContent>
            </Dialog.Portal>
        </Dialog.Root>
    )


}