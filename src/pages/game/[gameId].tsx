'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher-js';
import Message from '@/message';
import GameState from '@/gameState';
import { Box, Heading, Pagehead } from '@primer/react';
import { Image } from '@primer/react-brand'
import Board from '@/components/Board';


// TODO Bind different handlers to different events
// TODO secure pusher channel using private channel
// TODO get AI generated images
// TODO implement user actions

// Create New Game
// Ask a question (string, clientId)
// Eliminate characters ([character], clientId)
// Make a guess (character, clientId)

const characters = [
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-3m961q6QNYS6xKYwzFRefssn.png?st=2024-01-24T21%3A48%3A56Z&se=2024-01-24T23%3A48%3A56Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A34%3A36Z&ske=2024-01-25T22%3A34%3A36Z&sks=b&skv=2021-08-06&sig=bLriOqTjQVzwGpkVZZnJiyFXz0gCDorfqyjNYyzzHhw%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-EObQ1ivU2I9ZRbEAgKFm3yd0.png?st=2024-01-24T21%3A48%3A55Z&se=2024-01-24T23%3A48%3A55Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A11%3A48Z&ske=2024-01-25T16%3A11%3A48Z&sks=b&skv=2021-08-06&sig=D8TmdCaH4r2H1QbgbtGHVJ6EcFCO0tKwtAuHT6tV54s%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-XjVA6VjXgjCavuZwIiKHMjgB.png?st=2024-01-24T21%3A48%3A54Z&se=2024-01-24T23%3A48%3A54Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T21%3A59%3A20Z&ske=2024-01-25T21%3A59%3A20Z&sks=b&skv=2021-08-06&sig=VQVO%2Bvpt9v3dcgzjS67fmkJFiFA0N1Wn8AuVG1%2BTaKU%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-dN9odmUPpPDoZHO1ROerkh4z.png?st=2024-01-24T21%3A48%3A56Z&se=2024-01-24T23%3A48%3A56Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A03%3A44Z&ske=2024-01-25T22%3A03%3A44Z&sks=b&skv=2021-08-06&sig=HgErizvvRJkImUwYBYVyK7IfDQJNS6h2/izgxPk1prU%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-I7R2L8Xzz3Hj85wxjNa47JrO.png?st=2024-01-24T21%3A53%3A10Z&se=2024-01-24T23%3A53%3A10Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A00%3A52Z&ske=2024-01-25T22%3A00%3A52Z&sks=b&skv=2021-08-06&sig=ezggtudEF9hoVkjDAxXyShQkNFcR06grVsF2CsZ0xY0%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-24z0OrY47qLKfk9e1v2J2GUG.png?st=2024-01-24T21%3A53%3A11Z&se=2024-01-24T23%3A53%3A11Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A11%3A07Z&ske=2024-01-25T16%3A11%3A07Z&sks=b&skv=2021-08-06&sig=EMh30U5kCSK0eGPDLuX2Vbm0fWk3bNHULp0pslcFduk%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-KWX1SFy5KO3zuQZ38cDmaaYb.png?st=2024-01-24T21%3A53%3A07Z&se=2024-01-24T23%3A53%3A07Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A10%3A26Z&ske=2024-01-25T16%3A10%3A26Z&sks=b&skv=2021-08-06&sig=udYlzA8KF1GznCb1zeo/xn7PakT0uc2YQGq3Fz2H6Hg%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-KemirYxwAiQrkR2NdltAW7Qw.png?st=2024-01-24T21%3A53%3A10Z&se=2024-01-24T23%3A53%3A10Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A11%3A08Z&ske=2024-01-25T16%3A11%3A08Z&sks=b&skv=2021-08-06&sig=yaEZH1EugvmHxIfkfFn2zLEfXPp4aTG/WwaYtqrSLx8%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-D4vHgNBe6HnE6AoimvyxBUUG.png?st=2024-01-24T21%3A56%3A05Z&se=2024-01-24T23%3A56%3A05Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A12%3A29Z&ske=2024-01-25T16%3A12%3A29Z&sks=b&skv=2021-08-06&sig=RijWRtD/GSI%2ButSIxW7gXhnNKQqdrB8U5kBCfUBulhc%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-m6DgaswsGcY3hJ1a9RxtBp9F.png?st=2024-01-24T21%3A56%3A07Z&se=2024-01-24T23%3A56%3A07Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T21%3A58%3A53Z&ske=2024-01-25T21%3A58%3A53Z&sks=b&skv=2021-08-06&sig=G9lkDwkZ6waKAfx6R6PzzFfCano2MnMNNPEKGLZpIqQ%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-h9w8UAJjPLhfiRnJqro7RtWW.png?st=2024-01-24T21%3A56%3A05Z&se=2024-01-24T23%3A56%3A05Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A12%3A02Z&ske=2024-01-25T16%3A12%3A02Z&sks=b&skv=2021-08-06&sig=Sgf0y4G%2BHrjC4MfBSD2rDah2ERdWYhqBOn9ndzRs16s%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-PrXDmCdAwzqZCz17i90u92ZH.png?st=2024-01-24T21%3A56%3A04Z&se=2024-01-24T23%3A56%3A04Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A12%3A02Z&ske=2024-01-25T16%3A12%3A02Z&sks=b&skv=2021-08-06&sig=dd7gzWQNUgQk8kQKbeihQD3JxZ0iA/Sa00Nmzd0fefg%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-nM2VUfdNfEOKnMJhr0GrVuFz.png?st=2024-01-24T21%3A56%3A04Z&se=2024-01-24T23%3A56%3A04Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A06%3A43Z&ske=2024-01-25T22%3A06%3A43Z&sks=b&skv=2021-08-06&sig=n%2BkpUUgYTaaXRLhQA%2Bcp8vQQAmZ7vZOlqLXnjKUdkY8%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-e43tPo2R0zSseHl5VvuCVZ4m.png?st=2024-01-24T21%3A58%3A19Z&se=2024-01-24T23%3A58%3A19Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T04%3A16%3A52Z&ske=2024-01-25T04%3A16%3A52Z&sks=b&skv=2021-08-06&sig=KIapuO5HiS9So0IIznubvWiiUKKVoFzE6hcqPzfklvY%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-jTjqgnept8LL1VKuLTfmU2qP.png?st=2024-01-24T21%3A58%3A15Z&se=2024-01-24T23%3A58%3A15Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A11%3A10Z&ske=2024-01-25T16%3A11%3A10Z&sks=b&skv=2021-08-06&sig=Sui5Nu0ZrtB8QhjFD5KgFkCmQ8Dks96zs%2BeDKL1DUVU%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-2SBkrjjgyJslvRfR91QNhUgg.png?st=2024-01-24T21%3A58%3A18Z&se=2024-01-24T23%3A58%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A04%3A58Z&ske=2024-01-25T22%3A04%3A58Z&sks=b&skv=2021-08-06&sig=wBu%2B3qbk9vadPcm37gRWFIrCpwnPXxGPldcPpt9fpxA%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-mUhssUPFVvfkmJtutOw8YNOb.png?st=2024-01-24T21%3A58%3A16Z&se=2024-01-24T23%3A58%3A16Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A11%3A33Z&ske=2024-01-25T16%3A11%3A33Z&sks=b&skv=2021-08-06&sig=FGsTmGuOx8BqviSPvYUZLlnaWwL%2BrMEkero9lFVzD/U%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-Sw4UPG1fZXqaGVexHfRXn0os.png?st=2024-01-24T21%3A58%3A19Z&se=2024-01-24T23%3A58%3A19Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A11%3A52Z&ske=2024-01-25T16%3A11%3A52Z&sks=b&skv=2021-08-06&sig=zpJkG8jySXZ/vSUbLYtNjNvail0JL%2Bou2eKUL1Z6yUI%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-6NVu316yyTGpyntpEwPNKWlt.png?st=2024-01-24T22%3A19%3A15Z&se=2024-01-25T00%3A19%3A15Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A01%3A20Z&ske=2024-01-25T22%3A01%3A20Z&sks=b&skv=2021-08-06&sig=93zKVx3bW4bjUfx8lICSNklhRZjAGKuSP0827N8R40U%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-2SslQZMewHEjUARLHQt7OuHP.png?st=2024-01-24T22%3A19%3A12Z&se=2024-01-25T00%3A19%3A12Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A10%3A14Z&ske=2024-01-25T16%3A10%3A14Z&sks=b&skv=2021-08-06&sig=TTu6Il50L10oAUkSSV1Tsq17Qb%2B5vtcrvV49OKd/1GM%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-jyzGLPm3ga1Oxmaq4xUdIwHr.png?st=2024-01-24T22%3A19%3A13Z&se=2024-01-25T00%3A19%3A13Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A09%3A31Z&ske=2024-01-25T22%3A09%3A31Z&sks=b&skv=2021-08-06&sig=rj8gB9naNQd06HrsVVA%2Bj4THP/AtiZAGZ/L0nkby6EI%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-9czFytTyXlPh3yQewSGf7So1.png?st=2024-01-24T22%3A19%3A13Z&se=2024-01-25T00%3A19%3A13Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A12%3A20Z&ske=2024-01-25T16%3A12%3A20Z&sks=b&skv=2021-08-06&sig=nZFiyhN7f7TsVttbIAjRl7iuX0KDR3DSJ/UDmu5yAU4%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-XEwg0AWViNSRsBoaouPP3aAg.png?st=2024-01-24T22%3A27%3A19Z&se=2024-01-25T00%3A27%3A19Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T10%3A43%3A27Z&ske=2024-01-25T10%3A43%3A27Z&sks=b&skv=2021-08-06&sig=wrt77CGAztlGRZhBI/TFq7%2BcJL9h2k6/5e6Ce9WAOTs%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-mCr1GTzZlD2lRX45zr7QxJBw.png?st=2024-01-24T22%3A27%3A29Z&se=2024-01-25T00%3A27%3A29Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T21%3A59%3A19Z&ske=2024-01-25T21%3A59%3A19Z&sks=b&skv=2021-08-06&sig=SuLWS9JXjhTB02CeQC4F6ipRE%2BNXjLEKlORR/ut/7wo%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-drj0Rw9750XDZJwYgDohkoKw.png?st=2024-01-24T22%3A27%3A21Z&se=2024-01-25T00%3A27%3A21Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A05%3A51Z&ske=2024-01-25T22%3A05%3A51Z&sks=b&skv=2021-08-06&sig=XKVFFQl2Hhb4t%2B5iBKqw5/7bcJr15pZppjcKRDuQ38I%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-PUVNr5kzDEgSIDo4xOC2yt8k.png?st=2024-01-24T22%3A27%3A21Z&se=2024-01-25T00%3A27%3A21Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A05%3A11Z&ske=2024-01-25T16%3A05%3A11Z&sks=b&skv=2021-08-06&sig=7QhYhVsHoGkujRE1WxVD2dQF4RrzX4rmSZxxOjd9jzQ%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-fkVMbROmKQuyFIR8dhENmfxZ.png?st=2024-01-24T22%3A27%3A22Z&se=2024-01-25T00%3A27%3A22Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A14%3A00Z&ske=2024-01-25T16%3A14%3A00Z&sks=b&skv=2021-08-06&sig=lw35gKPyh2uKCJrRUaVL6Wd7B%2BVN/2Sg45dd7rPpKik%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-GuneNooj5mAa0O7qpjryakMV.png?st=2024-01-24T22%3A29%3A47Z&se=2024-01-25T00%3A29%3A47Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A11%3A52Z&ske=2024-01-25T16%3A11%3A52Z&sks=b&skv=2021-08-06&sig=t1ryQm629D25ZDYeoNXBuCGxpp8qvbmZYGorqdmX1D8%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-QnMmNhYQ4WS3X8oJ4JqnKUZZ.png?st=2024-01-24T22%3A29%3A41Z&se=2024-01-25T00%3A29%3A41Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T21%3A59%3A00Z&ske=2024-01-25T21%3A59%3A00Z&sks=b&skv=2021-08-06&sig=o3qXQRU6AVlehu/8Uzxx8xwERg/udt/PSG67lAjzehM%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-9Qayc3H1L6uIWHjpKqNujrsq.png?st=2024-01-24T22%3A29%3A43Z&se=2024-01-25T00%3A29%3A43Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A08%3A17Z&ske=2024-01-25T16%3A08%3A17Z&sks=b&skv=2021-08-06&sig=Duekkbd5M/jTP7vS2MW858Q1PWxzBqm4Q78dNs62U5M%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-pl5fDqSMRww6821OLNKLV6bE.png?st=2024-01-24T22%3A29%3A42Z&se=2024-01-25T00%3A29%3A42Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A02%3A38Z&ske=2024-01-25T22%3A02%3A38Z&sks=b&skv=2021-08-06&sig=NkZZNkB47zrVIqE3d%2BYhoCdBVJTMFLaCWg9r0%2Bc9z5o%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-iiITbdkCnFY0JK4uNylXwm2R.png?st=2024-01-24T22%3A29%3A46Z&se=2024-01-25T00%3A29%3A46Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A10%3A26Z&ske=2024-01-25T16%3A10%3A26Z&sks=b&skv=2021-08-06&sig=f/4qLS3cwBvynTw5FVicz4SoWvu5MQUB%2BZgjyEgQHnQ%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-mkV91buUBhKEtshjICs2yyb1.png?st=2024-01-24T22%3A31%3A40Z&se=2024-01-25T00%3A31%3A40Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A19%3A11Z&ske=2024-01-25T16%3A19%3A11Z&sks=b&skv=2021-08-06&sig=xl7JUa7XWV20a8JTWjxnYur08jSaVM1k9WxiV%2B5qIhs%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-skR1b9mRJRIPaJvNyKGzCXWp.png?st=2024-01-24T22%3A31%3A43Z&se=2024-01-25T00%3A31%3A43Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T21%3A59%3A20Z&ske=2024-01-25T21%3A59%3A20Z&sks=b&skv=2021-08-06&sig=fMsCEZnXEAdO5jUfVIddMrjjc4Q%2Bc/Px3aqr1Em/QzU%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-nvLxC2461C4d9zSgXtANTA8t.png?st=2024-01-24T22%3A31%3A45Z&se=2024-01-25T00%3A31%3A45Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T22%3A06%3A53Z&ske=2024-01-25T22%3A06%3A53Z&sks=b&skv=2021-08-06&sig=RwuZHwCbMmdo/IeLBsv//8o%2BV7ksZtKtA5/nY20LrGo%3D',
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-SUfNDNpPHtPq04Uz8huEnRFE/user-Nxi2Z1kUksBhG8mUVGu6LOR8/img-EZnIS0KngNjl2bDMnT4s1rsl.png?st=2024-01-24T22%3A31%3A41Z&se=2024-01-25T00%3A31%3A41Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-24T16%3A11%3A09Z&ske=2024-01-25T16%3A11%3A09Z&sks=b&skv=2021-08-06&sig=nViuPiEjXh7XsV5cChLs81H/n/ZJmBxElNr3rLFSVh0%3D',
]

export default function Game() {
  const randomIndex = Math.floor(Math.random() * characters.length);

  const router = useRouter();
  const [gameId, setGameId] = useState('');
  const [clientId, setClientId] = useState('');
  const [gameState, setGameState] = useState<GameState>({
    winner: '',
    board: characters.map((c: string) => ({ name: "Name", image: c, alive: true })),
    questions: [],
    myTurn: false,
    yourCharacter: characters[randomIndex] 
  });

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      const newClientId = uuidv4();
      localStorage.setItem('clientId', newClientId);
      setClientId(newClientId);
    }

    if (router.query.gameId) {
      setGameId(router.query.gameId as string);
    }

    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string
    });

    const channelName = `${process.env.NEXT_PUBLIC_PUSHER_CHANNEL as string}-${gameId as string}`;
    var channel = pusher.subscribe(channelName);
    channel.bind('ask', function (data: Message) {
      setGameState({ ...gameState, winner: data.clientId })
    });

    channel.bind('eliminate', function (data: Message) {
      setGameState({ ...gameState, board: gameState.board.map((c, index) => index === parseInt(data.message, 10) ? { ...c, alive: false } : c) })
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [router.query.gameId, gameId, gameState]);

  const handleClickCharacter = (index: number) => {
    postMessage({
      event: 'eliminate',
      message: `${index}`,
      clientId,
      gameId
    })
  }

  // const generateImages = async () => {

  //   fetch('/api/images')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Failed to generate images');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log('Generated images:', data);
  //       // setGameState({
  //       //   ...gameState,
  //       //   board: data.map((url: string) => ({
  //       //     name: 'Name',
  //       //     image: url,
  //       //     alive: true
  //       //   }))
  //       // });
  //     })
  //     .catch(error => {
  //       console.error('Failed to generate images:', error);
  //     });
  // }

  return (
    <>
      <Pagehead>
        <Heading sx={{ display: 'flex', justifyContent: 'center' }}>Guess Who?</Heading>
      </Pagehead>
      <Box>
        You are
        <Image src={gameState.yourCharacter} alt="character" width={120} height={120} />

      </Box>
      {/* <Button onClick={generateImages}>Generate Images</Button> */}
      <Board gameState={gameState} handleClickCharacter={handleClickCharacter} />
    </>
  );
}


const postMessage = async (message: Message) => {
  const res = await fetch('/api/pusher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    console.error('failed to push data');
  }
}
