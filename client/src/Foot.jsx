"use client";

import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

export default function Foot() {

  const currentYear = new Date().getFullYear();

  return (
    <Footer container>
      <div className="w-full max-w-screen-xl mx-auto px-6 py-8 flex flex-col items-center text-center">
        <div className="text-white text-2xl mb-8">Prosperiti</div>
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 text-left">
            <div>
              <FooterTitle title="about" />
              <FooterLinkGroup col>
                <FooterLink href="/">Prosperiti</FooterLink>
                <FooterLink href="/chat">Plan a Trip</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Follow us" />
              <FooterLinkGroup col>
                <FooterLink href="https://github.com/crhexa/prosperiti">Github</FooterLink>
                <FooterLink href="#">Discord</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal" />
              <FooterLinkGroup col>
                <FooterLink href="#">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms &amp; Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider className="my-8 w-full" />
        <div className="flex flex-col items-center gap-4">
          <FooterCopyright href="#" by="Prosperiti" year={currentYear} />
          <div className="flex space-x-6">
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitter} />
            <FooterIcon href="#" icon={BsGithub} />
            <FooterIcon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
