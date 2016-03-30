FROM debian:jessie

ENV DEBIAN_FRONTEND noninteractive

ENV LC_ALL en_US.UTF-8

RUN apt-get update
RUN apt-get install -y python3 python3-pip \
	locales \
	curl \
	procps xz-utils tar \
	nginx \
	psmisc

RUN curl -s https://nodejs.org/dist/v4.4.1/node-v4.4.1-linux-x64.tar.xz | tar  xJf - --strip-components=1 -C /

WORKDIR /workdir

COPY package.json ./
RUN npm install
ADD app/ app/
ADD public/ public/
ADD webpack.config.js ./
RUN node_modules/.bin/webpack --bail

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY nginx.conf /etc/nginx/nginx.conf
RUN locale-gen en_US.UTF-8  

EXPOSE 3000 80 12201/udp
COPY gelfserver.py .
ENTRYPOINT ["bash", "-xec"]
CMD ["(sleep 3; nginx ) & python3 gelfserver.py"]
