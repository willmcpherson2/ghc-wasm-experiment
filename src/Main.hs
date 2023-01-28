import Data.ByteString.Unsafe (unsafePackMallocCStringLen, unsafeUseAsCStringLen)
import Foreign (Ptr, copyBytes, malloc, mallocBytes, poke)
import Foreign.C (CChar)

main :: IO ()
main = mempty

foreign export ccall mallocPtr :: IO (Ptr (Ptr a))

mallocPtr :: IO (Ptr (Ptr a))
mallocPtr = malloc

foreign export ccall addExclamationToInput :: Ptr CChar -> Int -> Ptr (Ptr CChar) -> IO Int

addExclamationToInput :: Ptr CChar -> Int -> Ptr (Ptr CChar) -> IO Int
addExclamationToInput inputPtr inputLen outputPtrPtr = do
  input <- unsafePackMallocCStringLen (inputPtr, inputLen)
  unsafeUseAsCStringLen (input <> "!") $ \(buf, len) -> do
    outputPtr <- mallocBytes len
    poke outputPtrPtr outputPtr
    copyBytes outputPtr buf len
    pure len
