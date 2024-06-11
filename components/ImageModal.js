import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import ReactModal from "react-modal"

export const ImageModal = ({ isOpen, data, onClose, onOk }) => {
  const imgRef = useRef(null)
  // const [isOpen, setIsOpen] = useState(false)
  const [siteItem, setSiteItem] = useState(data)
  const [isDragging, setIsDragging] = useState(false)

  const handleClose = () => {
    setIsDragging(false)
    onClose()
  }
  const handleOk = () => {
    onOk(siteItem)
  }

  const handleMouseDown = (_e) => {
    setIsDragging(true)
    _e.preventDefault()
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const position = {
      x: _e.clientX - rect.left,
      y: _e.clientY - rect.top,
      width: 0,
      height: 0,
    }
    setSiteItem(v => ({
      ...v,
      ...position,
    }))
  }
  const handleMouseUp = (_e) => {
    setIsDragging(false)
    _e.preventDefault()
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const newWidth = _e.clientX - rect.left - siteItem.x
    const newHeight = _e.clientY - rect.top - siteItem.y
    setSiteItem(v => ({
      ...v,
      width: newWidth,
      height: newHeight,
    }))
  }
  const handleMouseMove = (_e) => {
    if (!isDragging) return
    _e.preventDefault()
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const newWidth = _e.clientX - rect.left - siteItem.x
    const newHeight = _e.clientY - rect.top - siteItem.y
    setSiteItem(v => ({
      ...v,
      width: newWidth,
      height: newHeight,
    }))
  }
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return <ReactModal
    isOpen={isOpen}
    className={'imageModalPortal'}
  // overlayClassName={'imageModalPortal'}
  >
    <div>
      <div className="btnGroup">
        <button
          className="primary-btn btnOk"
          onClick={() => { handleOk() }}
        >
          OK
        </button>
        <button
          className="primary-btn btnClose"
          onClick={() => { handleClose() }}
        >
          Close
        </button>
      </div>
      <img
        className="imageModalSource"
        ref={imgRef}
        src={data?.imgUrl}
        alt="new Image"
        onMouseDown={handleMouseDown}
        onDragStart={(e) => e.preventDefault()}
      />
      <div
        style={{
          position: 'absolute',
          width: siteItem?.width ?? 0,
          height: siteItem?.height ?? 0,
          left: siteItem?.x ?? 0,
          top: siteItem?.y ?? 0,
          backgroundColor: 'rgba(0, 100, 100, 0.5)',
          border: '1px dashed black',
          zIndex: 100,
        }}
      />
    </div>
  </ReactModal>
}