// Packages:
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from "@/lib/utils";
import { FileSpreadsheet } from 'lucide-react' // Add this import
import { uploadFileToBucket } from '@/utils/supabase/supabase-file-upload'
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/components/ui/use-toast" // Add this import
import { useRouter } from 'next/navigation' // Change this import
import { Button } from "@/components/ui/button";
import { LoginDialog } from '@/components/custom/header/login'
import { Loader2 } from 'lucide-react' // Add this import

// Typescript:
import {
    type DropzoneProps as _DropzoneProps,
    type DropzoneState as _DropzoneState,
    type FileRejection,
    type DropEvent
} from 'react-dropzone'

export interface DropzoneState extends _DropzoneState { }

export interface DropzoneProps extends Omit<_DropzoneProps, 'children'> {
    containerClassName?: string
    dropZoneClassName?: string
    children?: (dropzone: DropzoneState) => React.ReactNode
    showFilesList?: boolean
    showErrorMessage?: boolean
}

// Functions:

const Upload = ({
    className,
}: {
    className?: string
}) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={cn('lucide lucide-upload', className)}>
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
        <polyline points='17 8 12 3 7 8' />
        <line x1='12' x2='12' y1='3' y2='15' />
    </svg>
)

const PDF = ({
    className,
}: {
    className?: string
}) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={cn('lucide lucide-file-text', className)}>
        <path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' />
        <path d='M14 2v4a2 2 0 0 0 2 2h4' />
        <path d='M10 9H8' />
        <path d='M16 13H8' />
        <path d='M16 17H8' />
    </svg>
)

const Image = ({
    className,
}: {
    className?: string
}) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={cn('lucide lucide-image', className)}>
        <rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
        <circle cx='9' cy='9' r='2' />
        <path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
    </svg>
)

const Trash = ({
    className,
}: {
    className?: string
}) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={cn('lucide lucide-trash', className)}>
        <path d='M3 6h18' />
        <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
        <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
    </svg>
)

const Dropzone = ({
    containerClassName,
    dropZoneClassName,
    children,
    showFilesList = true,
    showErrorMessage = true,
    ...props
}: DropzoneProps) => {
    const supabase = createClient()
    const { toast } = useToast()
    const router = useRouter()

    // Add this state
    const [showLoginDialog, setShowLoginDialog] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Constants:
    const dropzone = useDropzone({
        ...props,
        accept: {
            'text/csv': ['.csv'],
            'application/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
            if (props.onDrop) {
                props.onDrop(acceptedFiles, fileRejections, event)
            } else {
                setIsUploading(true) // Set uploading state to true
                const { data, error } = await supabase.auth.getUser()

                if (!data.user) {
                    console.error('No user')
                    setShowLoginDialog(true)
                    setIsUploading(false)
                    return
                }

                const user_id = data.user.id

                for (const file of acceptedFiles) {
                    try {
                        const { data, error, uuid } = await uploadFileToBucket(file, user_id)
                        if (error) throw error

                        toast({
                            title: "Success",
                            description: `${file.name} uploaded successfully.`,
                        })

                        // Use router.push for client-side navigation
                        router.push(`/f/${user_id}/${uuid}`)
                    } catch (error) {
                        console.error('Error uploading file:', error)
                        toast({
                            title: "Error",
                            description: `Failed to upload ${file.name}`,
                            variant: "destructive",
                        })
                    }
                }

                setFilesUploaded(_filesUploaded => [..._filesUploaded, ...acceptedFiles])
                if (fileRejections.length > 0) {
                    let _errorMessage = `Could not upload ${fileRejections[0].file.name}`
                    if (fileRejections.length > 1) _errorMessage = _errorMessage + `, and ${fileRejections.length - 1} other files.`
                    setErrorMessage(_errorMessage)
                    toast({
                        title: "Error",
                        description: _errorMessage,
                        variant: "destructive",
                    })
                } else {
                    setErrorMessage('')
                }
                // setIsUploading(false) // Set uploading state back to false
            }
        },
    })

    // State:
    const [filesUploaded, setFilesUploaded] = useState<File[]>([])
    const [errorMessage, setErrorMessage] = useState<string>()

    // Functions:
    const deleteUploadedFile = (index: number) => {
        setFilesUploaded(_uploadedFiles => [
            ..._uploadedFiles.slice(0, index),
            ..._uploadedFiles.slice(index + 1),
        ])
    }

    // Return:
    return (
        <div
            className={cn('flex flex-col gap-2 w-full', containerClassName)}
        >
            {isUploading ? (
                <div className={cn('flex flex-col items-center justify-center w-full h-full min-h-[500px] flex-grow border-dashed border-2 border-gray-200 rounded-lg', dropZoneClassName)}>
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg">Uploading file...</p>
                </div>
            ) : (
                <div
                    {...dropzone.getRootProps()}
                    className={cn('flex flex-col items-center justify-center w-full h-full min-h-[500px] flex-grow border-dashed border-2 border-gray-200 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all select-none cursor-pointer', dropZoneClassName)}
                >
                    <div className='flex flex-col items-center gap-4'>
                        <div className='flex items-center flex-col gap-3 p-12 w-full'>
                            <FileSpreadsheet className='w-24 h-24 text-gray-400' />

                            {
                                children ? (
                                    <div className="flex items-center justify-center h-full w-full">
                                        {children(dropzone)}
                                    </div>
                                ) : dropzone.isDragAccept ? (
                                    <div className='flex items-center justify-center flex-col gap-1 h-full w-full'>
                                        <div className='text-2xl font-medium'>Drop your file here</div>
                                        <div className='text-lg text-gray-500'>let it go</div>
                                    </div>
                                ) : (
                                    <div className='flex items-center justify-center flex-col gap-1 h-full w-full'>
                                        <div className='text-2xl font-medium'>Upload a new file</div>
                                        <div className='text-lg text-gray-500'>Drag and drop your csv or excel file anywhere in this box</div>
                                        <Button className="mt-4" size="lg">
                                            Upload
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Add LoginDialog here */}
            <LoginDialog open={showLoginDialog} setOpen={setShowLoginDialog} hideTrigger={true} />
        </div>
    )
}

// Exports:
export default Dropzone