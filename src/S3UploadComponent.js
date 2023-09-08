import React from 'react';
import S3Uploader from 'react-s3-uploader';

const S3UploaderComponent = () => {
  const handleUploadFinish = (data) => {
    console.log(data);
  };

  return (
    <S3Uploader
      signingUrl="<your-signing-url>"
      signingUrlMethod="GET"
      accept="image/png,image/jpeg"
      onFinish={handleUploadFinish}
      uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
      contentDisposition="auto"
      server="s3"
      scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/gi, '')}
      s3path="speech-and-images/"
      preprocess={null}
      autoUpload={true}
      onError={null}
    />
  );
};

export default S3UploaderComponent;