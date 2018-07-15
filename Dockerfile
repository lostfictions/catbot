FROM node:10.6

MAINTAINER s

# RUN wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz &&\
#   mkdir ffmpeg-bin &&\
#   tar -xvf ffmpeg-release-64bit-static.tar.xz -C ffmpeg-bin/ --strip-components=1 --wildcards --no-anchored 'ffmpeg'

# ENV PATH "/ffmpeg-bin:${PATH}"

WORKDIR /code
COPY . /code

RUN yarn
RUN yarn build

ENV DEBUG=*
ENTRYPOINT yarn start
